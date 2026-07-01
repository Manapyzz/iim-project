import type {TvaType} from '../config/tva.js';

/**
 * Types partagés du skill accounting.
 *
 * Une Invoice arrive sous forme JSON — l'extraction PDF → JSON est
 * hors scope de ce skill (voir SKILL.md § INPUTS).
 */

export type InvoiceLine = {
  label: string;
  quantity: number;
  unitPriceHt: number;
  tvaType: TvaType;
};

export type Invoice = {
  id: string;
  issuedAt: string; // ISO date YYYY-MM-DD
  dueAt: string; // ISO date YYYY-MM-DD
  client: {
    name: string;
    email: string;
  };
  lines: InvoiceLine[];
  promoCode?: string;
  paidAt: string | null;
};

/** Résultat d'un calcul de facture unitaire. */
export type InvoiceCalculation = {
  ht: number;
  discount: number;
  htAfterDiscount: number;
  tva: number;
  ttc: number;
  perTvaType: Record<string, {ht: number; tva: number}>;
};

/** Résumé mensuel agrégé. */
export type MonthSummary = {
  month: string; // YYYY-MM
  count: number;
  countPaid: number;
  countUnpaid: number;
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  paidTtc: number;
  unpaidTtc: number;
  topClients: Array<{name: string; totalTtc: number; invoices: number}>;
  perTvaType: Record<string, {ht: number; tva: number}>;
};

/** Facture détectée en retard. */
export type OverduePayment = {
  invoiceId: string;
  clientName: string;
  clientEmail: string;
  amountTtc: number;
  dueAt: string;
  daysOverdue: number;
  severity: 'warning' | 'critical'; // > 30 jours = critical
};
