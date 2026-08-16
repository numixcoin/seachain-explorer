import { config } from "../config";

export function formatAmount(amount: string, denom: string): string {
  if (denom === config.baseDenom) {
    const value = Number(amount) / 10 ** config.exponent;
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${config.displayDenom}`;
  }
  return `${Number(amount).toLocaleString()} ${shortDenom(denom)}`;
}

export function shortDenom(denom: string): string {
  if (denom.startsWith("factory/")) {
    const parts = denom.split("/");
    return `${parts[2]} (factory)`;
  }
  return denom;
}

export function shortHash(value: string, size = 8): string {
  if (value.length <= size * 2 + 3) return value;
  return `${value.slice(0, size)}…${value.slice(-size)}`;
}

export function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${Math.floor(seconds)}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
