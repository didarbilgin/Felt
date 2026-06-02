import { ApiError } from '@/lib/ApiError';

function formatValidationEntry(entry: unknown): string {
  if (typeof entry === 'string') return entry;
  if (!entry || typeof entry !== 'object') return String(entry);

  const row = entry as { loc?: unknown; msg?: string; message?: string };
  const loc = Array.isArray(row.loc)
    ? row.loc.filter((part) => part !== 'body').join(' → ')
    : '';
  const msg = row.msg || row.message || 'Geçersiz değer';
  return loc ? `${loc}: ${msg}` : msg;
}

/** Turn API / network errors into a short Turkish message for admin toasts. */
export function formatApiErrorMessage(error: unknown, fallback = 'Kayıt başarısız.'): string {
  if (error instanceof ApiError) {
    const raw = error.message?.trim();
    if (!raw) return fallback;

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map(formatValidationEntry).join('\n');
      }
      if (parsed && typeof parsed === 'object' && 'detail' in parsed) {
        return formatApiErrorMessage(
          { detail: (parsed as { detail: unknown }).detail },
          fallback
        );
      }
    } catch {
      // plain string detail
    }

    return raw;
  }

  if (error && typeof error === 'object' && 'detail' in error) {
    const detail = (error as { detail: unknown }).detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map(formatValidationEntry).join('\n');
    }
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
