export function normalizeDateOnly(value) {
  const date = new Date(value);
  return new Date(`${date.toISOString().slice(0, 10)}T00:00:00.000Z`);
}

export function parseDateRange(from, to) {
  const fromDate = normalizeDateOnly(String(from));
  const toDate = normalizeDateOnly(String(to));
  const endExclusive = new Date(toDate);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
  return { fromDate, toDate, endExclusive };
}
