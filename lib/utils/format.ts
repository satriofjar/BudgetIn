const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

export function formatRupiah(amount: number): string {
  return `Rp ${rupiahFormatter.format(amount)}`;
}
