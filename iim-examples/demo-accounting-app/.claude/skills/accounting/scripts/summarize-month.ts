import {calculateInvoice} from './calculate-invoice.js';
import type {Invoice, MonthSummary} from './types.js';
import {logSessionEntry} from './log.js';

/**
 * Agrège les factures d'un mois donné (YYYY-MM) et retourne un résumé structuré.
 *
 * Filtre par `issuedAt.startsWith(month)` : une facture émise en juin est
 * comptée en juin même si payée en juillet.
 *
 * @param invoices toutes les factures disponibles
 * @param month au format YYYY-MM
 */
export function summarizeMonth(invoices: Invoice[], month: string): MonthSummary {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error(`Invalid month format "${month}", expected YYYY-MM`);
  }

  const monthInvoices = invoices.filter((inv) => inv.issuedAt.startsWith(month));

  let totalHt = 0;
  let totalTva = 0;
  let totalTtc = 0;
  let paidTtc = 0;
  let unpaidTtc = 0;
  let countPaid = 0;
  let countUnpaid = 0;
  const perTvaType: Record<string, {ht: number; tva: number}> = {};
  const clientAgg = new Map<string, {name: string; totalTtc: number; invoices: number}>();

  for (const invoice of monthInvoices) {
    const calc = calculateInvoice(invoice);
    totalHt += calc.htAfterDiscount;
    totalTva += calc.tva;
    totalTtc += calc.ttc;

    if (invoice.paidAt) {
      paidTtc += calc.ttc;
      countPaid++;
    } else {
      unpaidTtc += calc.ttc;
      countUnpaid++;
    }

    for (const [type, part] of Object.entries(calc.perTvaType)) {
      if (!perTvaType[type]) perTvaType[type] = {ht: 0, tva: 0};
      perTvaType[type].ht += part.ht;
      perTvaType[type].tva += part.tva;
    }

    const key = invoice.client.email;
    const existing = clientAgg.get(key) ?? {name: invoice.client.name, totalTtc: 0, invoices: 0};
    existing.totalTtc += calc.ttc;
    existing.invoices += 1;
    clientAgg.set(key, existing);
  }

  const topClients = Array.from(clientAgg.values())
    .sort((a, b) => b.totalTtc - a.totalTtc)
    .slice(0, 5)
    .map((c) => ({name: c.name, totalTtc: round2(c.totalTtc), invoices: c.invoices}));

  // Arrondi final des agrégats
  for (const type of Object.keys(perTvaType)) {
    perTvaType[type].ht = round2(perTvaType[type].ht);
    perTvaType[type].tva = round2(perTvaType[type].tva);
  }

  const result: MonthSummary = {
    month,
    count: monthInvoices.length,
    countPaid,
    countUnpaid,
    totalHt: round2(totalHt),
    totalTva: round2(totalTva),
    totalTtc: round2(totalTtc),
    paidTtc: round2(paidTtc),
    unpaidTtc: round2(unpaidTtc),
    topClients,
    perTvaType,
  };

  logSessionEntry('summarize-month', {
    input: {month, invoiceCount: invoices.length},
    output: {count: result.count, totalTtc: result.totalTtc},
  });

  return result;
}

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

/* --------------------------------------------------------------------------
 * CLI — usage :
 *   pnpm cli:summary fixtures/invoices-2026-06.json 2026-06
 * -------------------------------------------------------------------------- */

function isMain() {
  return import.meta.url === `file://${process.argv[1]}`;
}

if (isMain()) {
  const [path, month] = process.argv.slice(2);
  if (!path || !month) {
    console.error('Usage: cli:summary <fixtures.json> <YYYY-MM>');
    process.exit(1);
  }
  try {
    const {readFileSync} = await import('node:fs');
    const invoices = JSON.parse(readFileSync(path, 'utf-8')) as Invoice[];
    console.log(JSON.stringify(summarizeMonth(invoices, month), null, 2));
  } catch (e) {
    console.error(String(e));
    process.exit(1);
  }
}
