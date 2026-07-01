import {calculateInvoice} from './calculate-invoice.js';
import {gracePeriodFor} from '../config/overdue-thresholds.js';
import type {Invoice, OverduePayment} from './types.js';
import {logSessionEntry} from './log.js';

/**
 * Détecte les factures en retard de paiement.
 *
 * Règle : `paid_at` null ET (today - dueAt) > gracePeriodDays(ttc).
 * gracePeriodDays vient de config/overdue-thresholds.ts — plus le TTC est élevé,
 * plus la période de tolérance est longue (pratique commerciale).
 *
 * @param invoices toutes les factures
 * @param today ISO date de référence (par défaut : aujourd'hui, injectable pour tests)
 */
export function detectOverdue(invoices: Invoice[], today: string = todayIso()): OverduePayment[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) {
    throw new Error(`Invalid today format "${today}", expected YYYY-MM-DD`);
  }
  const todayMs = Date.parse(today);
  if (Number.isNaN(todayMs)) throw new Error(`Invalid today date "${today}"`);

  const result: OverduePayment[] = [];
  for (const invoice of invoices) {
    if (invoice.paidAt) continue;

    const dueMs = Date.parse(invoice.dueAt);
    if (Number.isNaN(dueMs)) continue; // date corrompue, on skip

    const daysSinceDue = Math.floor((todayMs - dueMs) / (1000 * 60 * 60 * 24));
    if (daysSinceDue <= 0) continue; // pas encore dû

    const calc = calculateInvoice(invoice);
    const grace = gracePeriodFor(calc.ttc);
    if (daysSinceDue <= grace) continue; // dans la tolérance

    result.push({
      invoiceId: invoice.id,
      clientName: invoice.client.name,
      clientEmail: invoice.client.email,
      amountTtc: calc.ttc,
      dueAt: invoice.dueAt,
      daysOverdue: daysSinceDue,
      severity: daysSinceDue > 30 ? 'critical' : 'warning',
    });
  }

  result.sort((a, b) => b.daysOverdue - a.daysOverdue);

  logSessionEntry('detect-overdue', {
    input: {today, invoiceCount: invoices.length},
    output: {overdueCount: result.length},
  });

  return result;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/* --------------------------------------------------------------------------
 * CLI — usage :
 *   pnpm cli:overdue fixtures/invoices-2026-06.json [2026-07-15]
 * -------------------------------------------------------------------------- */

function isMain() {
  return import.meta.url === `file://${process.argv[1]}`;
}

if (isMain()) {
  const [path, today] = process.argv.slice(2);
  if (!path) {
    console.error('Usage: cli:overdue <fixtures.json> [today YYYY-MM-DD]');
    process.exit(1);
  }
  try {
    const {readFileSync} = await import('node:fs');
    const invoices = JSON.parse(readFileSync(path, 'utf-8')) as Invoice[];
    const overdue = detectOverdue(invoices, today);
    console.log(JSON.stringify(overdue, null, 2));
  } catch (e) {
    console.error(String(e));
    process.exit(1);
  }
}
