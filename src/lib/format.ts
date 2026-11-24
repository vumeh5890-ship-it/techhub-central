import { format, parseISO } from "date-fns";

let currencySymbol = "₦";
let currencyCode = "NGN";
export function setCurrency(code: string, symbol: string) {
  currencyCode = code;
  currencySymbol = symbol;
}
export function money(n: number | string | null | undefined) {
  const v = Number(n ?? 0);
  return `${currencySymbol}${v.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
export function currency() {
  return { code: currencyCode, symbol: currencySymbol };
}
export function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  try {
    return format(parseISO(d), "dd MMM yyyy");
  } catch {
    return d;
  }
}
export function fmtDateTime(d: string | null | undefined) {
  if (!d) return "—";
  try {
    return format(parseISO(d), "dd MMM yyyy, HH:mm");
  } catch {
    return d;
  }
}
export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}
