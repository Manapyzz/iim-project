import {describe, it, expect, beforeAll} from 'vitest';
import {calculateInvoice} from './calculate-invoice.js';
import type {Invoice} from './types.js';

beforeAll(() => {
  process.env.ACCOUNTING_DISABLE_LOG = '1';
});

function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    id: 'INV-TEST-001',
    issuedAt: '2026-06-01',
    dueAt: '2026-06-15',
    client: {name: 'Test client', email: 't@example.com'},
    lines: [{label: 'test', quantity: 1, unitPriceHt: 100, tvaType: 'standard'}],
    paidAt: null,
    ...overrides,
  };
}

describe('calculateInvoice', () => {
  it('calculates a simple standard invoice', () => {
    const result = calculateInvoice(makeInvoice());
    expect(result.ht).toBe(100);
    expect(result.discount).toBe(0);
    expect(result.tva).toBe(20);
    expect(result.ttc).toBe(120);
  });

  it('applies quantity correctly', () => {
    const result = calculateInvoice(
      makeInvoice({
        lines: [{label: 'x3', quantity: 3, unitPriceHt: 50, tvaType: 'standard'}],
      }),
    );
    expect(result.ht).toBe(150);
    expect(result.ttc).toBe(180);
  });

  it('applies TVA reduit correctly (10 %)', () => {
    const result = calculateInvoice(
      makeInvoice({lines: [{label: 'reduit', quantity: 1, unitPriceHt: 100, tvaType: 'reduit'}]}),
    );
    expect(result.tva).toBe(10);
    expect(result.ttc).toBe(110);
  });

  it('applies TVA super-reduit correctly (5.5 %)', () => {
    const result = calculateInvoice(
      makeInvoice({lines: [{label: 'livre', quantity: 1, unitPriceHt: 100, tvaType: 'super-reduit'}]}),
    );
    expect(result.tva).toBe(5.5);
    expect(result.ttc).toBe(105.5);
  });

  it('mixes multiple TVA types on the same invoice', () => {
    const result = calculateInvoice(
      makeInvoice({
        lines: [
          {label: 'service', quantity: 1, unitPriceHt: 100, tvaType: 'standard'},
          {label: 'nourriture', quantity: 1, unitPriceHt: 50, tvaType: 'super-reduit'},
        ],
      }),
    );
    expect(result.ht).toBe(150);
    // 100 * 0.20 + 50 * 0.055 = 20 + 2.75 = 22.75
    expect(result.tva).toBe(22.75);
    expect(result.ttc).toBe(172.75);
    expect(result.perTvaType.standard).toEqual({ht: 100, tva: 20});
    expect(result.perTvaType['super-reduit']).toEqual({ht: 50, tva: 2.75});
  });

  it('applies WELCOME10 promo (-10 % sur HT)', () => {
    const result = calculateInvoice(makeInvoice({promoCode: 'WELCOME10'}));
    expect(result.discount).toBe(10);
    expect(result.htAfterDiscount).toBe(90);
    expect(result.tva).toBe(18);
    expect(result.ttc).toBe(108);
  });

  it('applies STUDENT20 promo (-20 %)', () => {
    const result = calculateInvoice(makeInvoice({promoCode: 'STUDENT20'}));
    expect(result.discount).toBe(20);
    expect(result.ttc).toBe(96);
  });

  it('applies BLACKFRIDAY promo when minAmountHt met', () => {
    const result = calculateInvoice(
      makeInvoice({
        lines: [{label: 'bulk', quantity: 1, unitPriceHt: 200, tvaType: 'standard'}],
        promoCode: 'BLACKFRIDAY',
      }),
    );
    expect(result.discount).toBe(60);
    expect(result.ttc).toBe(168);
  });

  it('throws when BLACKFRIDAY minAmountHt not met', () => {
    // HT = 50, seuil BLACKFRIDAY = 100 → doit rejeter
    expect(() =>
      calculateInvoice(
        makeInvoice({
          lines: [{label: 'small', quantity: 1, unitPriceHt: 50, tvaType: 'standard'}],
          promoCode: 'BLACKFRIDAY',
        }),
      ),
    ).toThrow(/min HT/);
  });

  it('throws on unknown promo code', () => {
    expect(() => calculateInvoice(makeInvoice({promoCode: 'FAKE99'}))).toThrow(/Unknown promo/);
  });

  it('throws on unknown TVA type', () => {
    expect(() =>
      calculateInvoice(
        makeInvoice({
          // @ts-expect-error volontairement invalide pour tester le garde
          lines: [{label: 'x', quantity: 1, unitPriceHt: 10, tvaType: 'exotique'}],
        }),
      ),
    ).toThrow(/Unknown TVA type/);
  });

  it('throws on negative price', () => {
    expect(() =>
      calculateInvoice(
        makeInvoice({lines: [{label: 'x', quantity: 1, unitPriceHt: -10, tvaType: 'standard'}]}),
      ),
    ).toThrow(/Negative price/);
  });

  it('throws on invalid quantity', () => {
    expect(() =>
      calculateInvoice(
        makeInvoice({lines: [{label: 'x', quantity: 0, unitPriceHt: 10, tvaType: 'standard'}]}),
      ),
    ).toThrow(/Invalid quantity/);
  });

  it('throws on empty invoice', () => {
    expect(() => calculateInvoice(makeInvoice({lines: []}))).toThrow(/no lines/);
  });
});
