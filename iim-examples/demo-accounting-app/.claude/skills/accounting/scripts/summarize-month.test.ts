import {describe, it, expect, beforeAll} from 'vitest';
import {summarizeMonth} from './summarize-month.js';
import type {Invoice} from './types.js';

beforeAll(() => {
  process.env.ACCOUNTING_DISABLE_LOG = '1';
});

const INVOICES: Invoice[] = [
  {
    id: 'A',
    issuedAt: '2026-06-01',
    dueAt: '2026-06-15',
    client: {name: 'Alice', email: 'alice@example.com'},
    lines: [{label: 'x', quantity: 1, unitPriceHt: 100, tvaType: 'standard'}],
    paidAt: '2026-06-05',
  },
  {
    id: 'B',
    issuedAt: '2026-06-10',
    dueAt: '2026-06-24',
    client: {name: 'Bob', email: 'bob@example.com'},
    lines: [{label: 'y', quantity: 2, unitPriceHt: 50, tvaType: 'reduit'}],
    paidAt: null,
  },
  {
    id: 'C',
    issuedAt: '2026-06-15',
    dueAt: '2026-06-29',
    client: {name: 'Alice', email: 'alice@example.com'},
    lines: [{label: 'z', quantity: 1, unitPriceHt: 200, tvaType: 'standard'}],
    paidAt: '2026-06-25',
  },
  {
    // hors juin - ne doit PAS être comptée
    id: 'D',
    issuedAt: '2026-07-01',
    dueAt: '2026-07-15',
    client: {name: 'Charlie', email: 'charlie@example.com'},
    lines: [{label: 'z', quantity: 1, unitPriceHt: 100, tvaType: 'standard'}],
    paidAt: null,
  },
];

describe('summarizeMonth', () => {
  const summary = summarizeMonth(INVOICES, '2026-06');

  it('only counts invoices from the requested month', () => {
    expect(summary.count).toBe(3);
  });

  it('separates paid vs unpaid', () => {
    expect(summary.countPaid).toBe(2);
    expect(summary.countUnpaid).toBe(1);
  });

  it('computes correct HT total', () => {
    // 100 + 100 (2x50) + 200 = 400
    expect(summary.totalHt).toBe(400);
  });

  it('computes correct TVA total', () => {
    // 100*0.20 + 100*0.10 + 200*0.20 = 20 + 10 + 40 = 70
    expect(summary.totalTva).toBe(70);
  });

  it('computes correct TTC total', () => {
    expect(summary.totalTtc).toBe(470);
  });

  it('splits paid vs unpaid TTC', () => {
    expect(summary.paidTtc).toBe(120 + 240); // A + C
    expect(summary.unpaidTtc).toBe(110); // B
  });

  it('aggregates by TVA type', () => {
    expect(summary.perTvaType.standard.ht).toBe(300);
    expect(summary.perTvaType.standard.tva).toBe(60);
    expect(summary.perTvaType.reduit.ht).toBe(100);
    expect(summary.perTvaType.reduit.tva).toBe(10);
  });

  it('ranks top clients by TTC descending', () => {
    expect(summary.topClients[0].name).toBe('Alice');
    expect(summary.topClients[0].invoices).toBe(2);
    expect(summary.topClients[0].totalTtc).toBe(360);
    expect(summary.topClients[1].name).toBe('Bob');
  });

  it('rejects invalid month format', () => {
    expect(() => summarizeMonth(INVOICES, '2026-6')).toThrow(/YYYY-MM/);
    expect(() => summarizeMonth(INVOICES, '06-2026')).toThrow(/YYYY-MM/);
  });

  it('returns empty summary for a month with no invoices', () => {
    const s = summarizeMonth(INVOICES, '2025-01');
    expect(s.count).toBe(0);
    expect(s.totalTtc).toBe(0);
    expect(s.topClients).toHaveLength(0);
  });
});
