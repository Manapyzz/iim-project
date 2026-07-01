import {describe, it, expect, beforeAll} from 'vitest';
import {detectOverdue} from './detect-overdue.js';
import type {Invoice} from './types.js';

beforeAll(() => {
  process.env.ACCOUNTING_DISABLE_LOG = '1';
});

const INVOICES: Invoice[] = [
  {
    id: 'PAID',
    issuedAt: '2026-06-01',
    dueAt: '2026-06-10',
    client: {name: 'Alice', email: 'a@ex.com'},
    lines: [{label: 'x', quantity: 1, unitPriceHt: 100, tvaType: 'standard'}],
    paidAt: '2026-06-08',
  },
  {
    id: 'NOT_YET_DUE',
    // today = 2026-07-15, dueAt = 2026-07-20 → pas encore due
    issuedAt: '2026-07-05',
    dueAt: '2026-07-20',
    client: {name: 'Bob', email: 'b@ex.com'},
    lines: [{label: 'x', quantity: 1, unitPriceHt: 50, tvaType: 'standard'}],
    paidAt: null,
  },
  {
    id: 'GRACE_TOLERATED',
    // TTC = 60, gracePeriod = 3 jours
    issuedAt: '2026-06-25',
    dueAt: '2026-06-28',
    client: {name: 'Charlie', email: 'c@ex.com'},
    lines: [{label: 'x', quantity: 1, unitPriceHt: 50, tvaType: 'standard'}],
    paidAt: null,
  },
  {
    id: 'SMALL_OVERDUE',
    // TTC = 60, dueAt = 06-05, today = 07-15 → 40 j > grace 3 j
    issuedAt: '2026-05-25',
    dueAt: '2026-06-05',
    client: {name: 'Denise', email: 'd@ex.com'},
    lines: [{label: 'x', quantity: 1, unitPriceHt: 50, tvaType: 'standard'}],
    paidAt: null,
  },
  {
    id: 'BIG_OVERDUE_CRITICAL',
    // TTC = 1200, dueAt = 05-01, today = 07-15 → 75 j > grace 15 j, > 30 → critical
    issuedAt: '2026-04-15',
    dueAt: '2026-05-01',
    client: {name: 'Enzo', email: 'e@ex.com'},
    lines: [{label: 'gros ticket', quantity: 1, unitPriceHt: 1000, tvaType: 'standard'}],
    paidAt: null,
  },
];

describe('detectOverdue', () => {
  const overdue = detectOverdue(INVOICES, '2026-07-15');

  it('ignores paid invoices', () => {
    expect(overdue.find((o) => o.invoiceId === 'PAID')).toBeUndefined();
  });

  it('ignores invoices not yet due (today <= dueAt)', () => {
    expect(overdue.find((o) => o.invoiceId === 'NOT_YET_DUE')).toBeUndefined();
  });

  it('respects the grace period for small amounts', () => {
    // GRACE_TOLERATED : 17 jours dépassés MAIS pas au dessus de la tolérance calculée
    // dueAt 06-28, today 07-15 → 17 jours. TTC = 60 → grace 3j → doit être détectée
    const grace = overdue.find((o) => o.invoiceId === 'GRACE_TOLERATED');
    expect(grace).toBeDefined();
    expect(grace?.daysOverdue).toBe(17);
  });

  it('detects small overdue as warning', () => {
    const small = overdue.find((o) => o.invoiceId === 'SMALL_OVERDUE');
    expect(small).toBeDefined();
    expect(small?.severity).toBe('critical'); // 40 j > 30 → critical
    expect(small?.daysOverdue).toBe(40);
  });

  it('marks > 30 days as critical', () => {
    const big = overdue.find((o) => o.invoiceId === 'BIG_OVERDUE_CRITICAL');
    expect(big).toBeDefined();
    expect(big?.severity).toBe('critical');
    expect(big?.daysOverdue).toBe(75);
    expect(big?.amountTtc).toBe(1200);
  });

  it('sorts by daysOverdue descending', () => {
    const ids = overdue.map((o) => o.invoiceId);
    // Ordre attendu selon daysOverdue :
    // BIG_OVERDUE_CRITICAL 75 > SMALL_OVERDUE 40 > GRACE_TOLERATED 17
    expect(ids[0]).toBe('BIG_OVERDUE_CRITICAL');
    expect(ids[1]).toBe('SMALL_OVERDUE');
  });

  it('rejects invalid today format', () => {
    expect(() => detectOverdue(INVOICES, '15-07-2026')).toThrow(/YYYY-MM-DD/);
  });
});
