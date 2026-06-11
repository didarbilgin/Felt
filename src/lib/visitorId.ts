const VISITOR_ID_KEY = 'felt_visitor_id';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createVisitorId(): string {
  return crypto.randomUUID();
}

/** Anonymous visitor id persisted in localStorage (no IP, no PII). */
export function getOrCreateVisitorId(): string {
  if (typeof localStorage === 'undefined') {
    return createVisitorId();
  }

  const existing = localStorage.getItem(VISITOR_ID_KEY);
  if (existing && UUID_RE.test(existing)) {
    return existing;
  }

  const next = createVisitorId();
  localStorage.setItem(VISITOR_ID_KEY, next);
  return next;
}
