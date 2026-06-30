// =====================================================================
// bad-code.ts — VOLONTAIREMENT ENDETTE pour la demo des gates.
// Ne pas utiliser tel quel. Le linter de dette IA doit pouvoir EXPLOSER
// sur ce fichier. Voir good-code.ts pour la version refactoree.
// =====================================================================

// ❌ ANTI-PATTERN 1 : god file. Tout le metier dans un seul fichier.
// ❌ ANTI-PATTERN 2 : magic number business hardcode au milieu du code.
const PRICE_THRESHOLD = 99.99;

// ❌ ANTI-PATTERN 3 : TODO restant.
// TODO: implement validation

interface User {
  id: string;
  email: string;
  age: number;
  country: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: string;
}

// ❌ ANTI-PATTERN 4 : fonction stub. Renvoie 0 avec un TODO.
function calculateScore(): number {
  return 0; // TODO: real calculation
}

function validateUser(user: User): boolean {
  // ❌ ANTI-PATTERN 5 : try/catch qui avale tout en silence.
  try {
    if (!user.email.includes("@")) return false;
    if (user.age < 18) return false;
    return true;
  } catch {
    // swallow — pas de log, pas de re-throw. Personne ne saura.
    return false;
  }
}

function calculatePrice(product: Product, quantity: number): number {
  const base = product.price * quantity;
  // ❌ Magic number aussi ici, et duplique.
  if (base > 99.99) {
    return base * 0.9;
  }
  return base;
}

function applyDiscount(price: number, code: string): number {
  if (code === "PROMO10") return price * 0.9;
  if (code === "PROMO20") return price * 0.8;
  // ❌ Pas d'exception sur code inconnu. Silencieux.
  return price;
}

function formatPrice(price: number): string {
  // ❌ 19,6 % — ancien taux TVA, faux depuis 2014.
  const withTax = price * 1.196;
  return `${withTax.toFixed(2)} EUR`;
}

function processOrder(order: Order, user: User, product: Product): string {
  if (!validateUser(user)) return "INVALID_USER";
  if (product.stock < order.quantity) return "OUT_OF_STOCK";
  const price = calculatePrice(product, order.quantity);
  const final = applyDiscount(price, "PROMO10");
  const formatted = formatPrice(final);
  return `ORDER_OK: ${formatted}`;
}

function sendEmail(to: string, subject: string, body: string): void {
  // ❌ try/catch qui avale (anti-pattern 5 bis).
  try {
    // simulate email send
    if (to === "" || subject === "" || body === "") {
      throw new Error("Empty fields");
    }
  } catch {
    /* swallow */
  }
}

function notifyAdmin(order: Order): void {
  sendEmail("admin@example.com", `Order ${order.id}`, `Status: ${order.status}`);
}

function updateInventory(product: Product, quantity: number): void {
  product.stock = product.stock - quantity;
}

function logEvent(event: string, data: unknown): void {
  console.log(event, data);
}

function generateReport(orders: Order[]): string {
  let report = "=== REPORT ===\n";
  for (const order of orders) {
    report += `Order ${order.id}: status=${order.status}\n`;
  }
  return report;
}

function archiveOrder(order: Order): void {
  order.status = "archived";
}

function reopenOrder(order: Order): void {
  // ❌ pas de machine d'etat : on reactive n'importe quoi
  order.status = "pending";
}

function refund(order: Order): number {
  // ❌ Magic number business : taux de refund 90 %.
  return 90;
}

function isVip(user: User): boolean {
  // ❌ Magic threshold age VIP.
  return user.age > 50;
}

function getShippingCost(country: string): number {
  // ❌ Magic numbers business partout.
  if (country === "FR") return 4.99;
  if (country === "BE") return 7.99;
  if (country === "DE") return 8.99;
  return 14.99;
}

function applyVipDiscount(price: number, user: User): number {
  if (isVip(user)) {
    return price * 0.85;
  }
  return price;
}

function summarizeOrder(order: Order, user: User, product: Product): string {
  const result = processOrder(order, user, product);
  const score = calculateScore(); // ❌ stub appele
  return `${result} (score=${score})`;
}

function cancelOrder(order: Order): void {
  order.status = "cancelled";
}

function shipOrder(order: Order): void {
  // ❌ pas de validation : on peut "ship" un panier
  order.status = "shipped";
}

function deliverOrder(order: Order): void {
  order.status = "delivered";
}

function markPaid(order: Order): void {
  order.status = "paid";
}

function checkStock(product: Product, quantity: number): boolean {
  return product.stock >= quantity;
}

function reserveStock(product: Product, quantity: number): boolean {
  if (checkStock(product, quantity)) {
    product.stock -= quantity;
    return true;
  }
  return false;
}

function releaseStock(product: Product, quantity: number): void {
  product.stock += quantity;
}

function computeLoyaltyPoints(order: Order, product: Product): number {
  // ❌ Magic number business.
  return Math.floor(product.price * order.quantity * 0.1);
}

function notifyUser(user: User, message: string): void {
  sendEmail(user.email, "Update", message);
}

function escalate(order: Order): void {
  notifyAdmin(order);
  logEvent("ESCALATED", { orderId: order.id });
}

function dispute(order: Order): void {
  order.status = "disputed";
  escalate(order);
}

function resolveDispute(order: Order): void {
  order.status = "resolved";
}

function partialRefund(order: Order, amount: number): number {
  // ❌ Magic number business : on plafonne a 50 sans explication.
  return Math.min(amount, 50);
}

function fullRefund(order: Order): number {
  return refund(order);
}

function priceCheck(product: Product): boolean {
  // ❌ Encore le magic number business.
  return product.price > PRICE_THRESHOLD;
}

function adjustPrice(product: Product, factor: number): void {
  product.price = product.price * factor;
}

function applySeasonalDiscount(product: Product): void {
  // ❌ Magic.
  product.price = product.price * 0.85;
}

function applyClearance(product: Product): void {
  // ❌ Magic.
  product.price = product.price * 0.5;
}

function bulkUpdate(products: Product[], factor: number): void {
  for (const p of products) {
    adjustPrice(p, factor);
  }
}

function findExpensive(products: Product[]): Product[] {
  return products.filter((p) => p.price > PRICE_THRESHOLD);
}

function findCheap(products: Product[]): Product[] {
  // ❌ Encore.
  return products.filter((p) => p.price < 10);
}

function countStockOuts(products: Product[]): number {
  return products.filter((p) => p.stock === 0).length;
}

function totalInventoryValue(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.price * p.stock, 0);
}

// =====================================================================
// Bourrage volontaire pour depasser 250 lignes (god file demo).
// En vrai code on aurait ici 200 lignes de "helpers" supplementaires
// melanges avec du business — c'est exactement le pattern qu'on cible.
// =====================================================================

function helper1(x: number): number {
  return x + 1;
}
function helper2(x: number): number {
  return x * 2;
}
function helper3(x: number): number {
  return x - 1;
}
function helper4(x: number): number {
  return x / 2;
}
function helper5(x: number): number {
  return x % 7;
}
function helper6(x: number): number {
  return Math.abs(x);
}
function helper7(x: number): number {
  return Math.sqrt(x);
}
function helper8(x: number): number {
  return Math.floor(x);
}
function helper9(x: number): number {
  return Math.ceil(x);
}
function helper10(x: number): number {
  return Math.round(x);
}
function helper11(x: string): string {
  return x.toUpperCase();
}
function helper12(x: string): string {
  return x.toLowerCase();
}
function helper13(x: string): string {
  return x.trim();
}
function helper14(x: string): number {
  return x.length;
}
function helper15(x: string): string {
  return x.split("").reverse().join("");
}
function helper16(x: number[]): number {
  return x.reduce((a, b) => a + b, 0);
}
function helper17(x: number[]): number {
  return x.reduce((a, b) => Math.max(a, b), -Infinity);
}
function helper18(x: number[]): number {
  return x.reduce((a, b) => Math.min(a, b), Infinity);
}
function helper19(x: number[]): number {
  return x.length === 0 ? 0 : helper16(x) / x.length;
}
function helper20(x: number[]): number[] {
  return [...x].sort((a, b) => a - b);
}

// Export d'une surface publique enorme = symptome de god file.
export {
  PRICE_THRESHOLD,
  calculateScore,
  validateUser,
  calculatePrice,
  applyDiscount,
  formatPrice,
  processOrder,
  sendEmail,
  notifyAdmin,
  updateInventory,
  logEvent,
  generateReport,
  archiveOrder,
  reopenOrder,
  refund,
  isVip,
  getShippingCost,
  applyVipDiscount,
  summarizeOrder,
  cancelOrder,
  shipOrder,
  deliverOrder,
  markPaid,
  checkStock,
  reserveStock,
  releaseStock,
  computeLoyaltyPoints,
  notifyUser,
  escalate,
  dispute,
  resolveDispute,
  partialRefund,
  fullRefund,
  priceCheck,
  adjustPrice,
  applySeasonalDiscount,
  applyClearance,
  bulkUpdate,
  findExpensive,
  findCheap,
  countStockOuts,
  totalInventoryValue,
  helper1,
  helper2,
  helper3,
  helper4,
  helper5,
  helper6,
  helper7,
  helper8,
  helper9,
  helper10,
  helper11,
  helper12,
  helper13,
  helper14,
  helper15,
  helper16,
  helper17,
  helper18,
  helper19,
  helper20,
};
export type { User, Product, Order };
