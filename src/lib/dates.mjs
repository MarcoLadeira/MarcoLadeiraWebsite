const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** "2026-03-18" -> "18 March 2026" (Irish/British order). */
export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return d ? `${d} ${MONTHS[m - 1]} ${y}` : `${MONTHS[m - 1]} ${y}`;
}
export const rfc822 = (iso) => new Date(`${iso}T09:00:00Z`).toUTCString();
