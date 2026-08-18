export type TenderStatus = 'open' | 'closing' | 'closed';

/** Whole days remaining until a deadline (negative when past). */
export function daysLeft(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
}

/** Derive a live status from the deadline: closed < 0d, closing ≤ 7d, else open. */
export function tenderStatus(deadline: string): TenderStatus {
  const d = daysLeft(deadline);
  if (d < 0) return 'closed';
  if (d <= 7) return 'closing';
  return 'open';
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-KE', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
