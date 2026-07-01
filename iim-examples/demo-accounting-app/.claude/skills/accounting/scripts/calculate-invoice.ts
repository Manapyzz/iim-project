import {TVA_RATES, isTvaType, type TvaType} from '../config/tva.js';
import {PROMO_CODES, MAX_DISCOUNT_RATE, isKnownPromo} from '../config/promo-codes.js';
import type {Invoice, InvoiceCalculation, InvoiceLine} from './types.js';
import {logSessionEntry} from './log.js';

/**
 * Calcule les montants HT / remise / TVA / TTC d'une facture unitaire.
 *
 * Règle fiscale française : la remise s'applique sur le HT AVANT calcul de la TVA.
 * Les taux de TVA proviennent de config/tva.ts (jamais hardcodés).
 * Les règles promo proviennent de config/promo-codes.ts (idem).
 *
 * @throws si un taux de TVA est inconnu, si un code promo est inconnu,
 * si le seuil minimum d'un promo n'est pas atteint, ou si des montants
 * sont négatifs.
 */
export function calculateInvoice(invoice: Invoice): InvoiceCalculation {
  if (invoice.lines.length === 0) {
    throw new Error('Invoice has no lines');
  }

  // Étape 1 : total HT + regroupement par type de TVA
  const perTvaTypeHt: Record<TvaType, number> = {
    standard: 0,
    reduit: 0,
    'super-reduit': 0,
  };

  for (const line of invoice.lines) {
    if (line.quantity <= 0) {
      throw new Error(`Invalid quantity on line "${line.label}"`);
    }
    if (line.unitPriceHt < 0) {
      throw new Error(`Negative price on line "${line.label}"`);
    }
    if (!isTvaType(line.tvaType)) {
      throw new Error(`Unknown TVA type "${line.tvaType}" on line "${line.label}"`);
    }
    perTvaTypeHt[line.tvaType] += line.unitPriceHt * line.quantity;
  }

  const ht = Object.values(perTvaTypeHt).reduce((a, b) => a + b, 0);

  // Étape 2 : remise (sur le HT AVANT TVA)
  let discountRate = 0;
  if (invoice.promoCode) {
    if (!isKnownPromo(invoice.promoCode)) {
      throw new Error(`Unknown promo code "${invoice.promoCode}"`);
    }
    const rule = PROMO_CODES[invoice.promoCode];
    if (rule.minAmountHt !== undefined && ht < rule.minAmountHt) {
      throw new Error(
        `Promo "${rule.code}" requires min HT ${rule.minAmountHt}€, got ${ht}€`,
      );
    }
    discountRate = Math.min(rule.discountRate, MAX_DISCOUNT_RATE);
  }
  const discount = round2(ht * discountRate);
  const htAfterDiscount = round2(ht - discount);

  // Étape 3 : TVA par type (proportionnelle à la répartition HT)
  const perTvaType: Record<string, {ht: number; tva: number}> = {};
  let tvaTotal = 0;
  for (const [type, htPart] of Object.entries(perTvaTypeHt) as [TvaType, number][]) {
    if (htPart === 0) continue;
    // On applique la remise au prorata de chaque type de TVA
    const share = htPart / ht;
    const htPartAfterDiscount = htPart - discount * share;
    const tva = htPartAfterDiscount * TVA_RATES[type];
    perTvaType[type] = {ht: round2(htPartAfterDiscount), tva: round2(tva)};
    tvaTotal += tva;
  }

  const tva = round2(tvaTotal);
  const ttc = round2(htAfterDiscount + tva);

  const result: InvoiceCalculation = {
    ht: round2(ht),
    discount,
    htAfterDiscount,
    tva,
    ttc,
    perTvaType,
  };

  logSessionEntry('calculate-invoice', {
    input: {invoiceId: invoice.id, lines: invoice.lines.length, promo: invoice.promoCode ?? null},
    output: {ht: result.ht, ttc: result.ttc},
  });

  return result;
}

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

/* --------------------------------------------------------------------------
 * CLI — usage :
 *   pnpm cli:invoice fixtures/invoices-2026-06.json INV-2026-06-001
 * ou :
 *   pnpm cli:invoice --amount 150 --tva standard --promo WELCOME10
 * -------------------------------------------------------------------------- */

function isMain() {
  return import.meta.url === `file://${process.argv[1]}`;
}

if (isMain()) {
  const args = process.argv.slice(2);
  try {
    if (args[0] === '--amount') {
      const amount = Number(args[1]);
      const tva = (args[3] ?? 'standard') as TvaType;
      const promo = args[5];
      const inv: Invoice = {
        id: 'CLI-INLINE',
        issuedAt: new Date().toISOString().slice(0, 10),
        dueAt: new Date().toISOString().slice(0, 10),
        client: {name: 'CLI user', email: 'cli@example.com'},
        lines: [{label: 'CLI line', quantity: 1, unitPriceHt: amount, tvaType: tva}],
        promoCode: promo,
        paidAt: null,
      };
      console.log(JSON.stringify(calculateInvoice(inv), null, 2));
    } else if (args[0]) {
      const {readFileSync} = await import('node:fs');
      const path = args[0];
      const invoiceId = args[1];
      const invoices = JSON.parse(readFileSync(path, 'utf-8')) as Invoice[];
      const inv = invoices.find((i) => i.id === invoiceId);
      if (!inv) throw new Error(`Invoice "${invoiceId}" not found in ${path}`);
      console.log(JSON.stringify(calculateInvoice(inv), null, 2));
    } else {
      console.error('Usage:');
      console.error('  cli:invoice <fixtures.json> <invoiceId>');
      console.error('  cli:invoice --amount 150 --tva standard --promo WELCOME10');
      process.exit(1);
    }
  } catch (e) {
    console.error(String(e));
    process.exit(1);
  }
}
