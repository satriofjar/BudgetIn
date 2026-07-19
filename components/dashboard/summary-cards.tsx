import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils/format";

interface StatTileProps {
  label: string;
  value: number;
  colorClassName?: string;
}

function StatTile({ label, value, colorClassName }: StatTileProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-semibold ${colorClassName ?? ""}`}>{formatRupiah(value)}</p>
      </CardContent>
    </Card>
  );
}

interface SummaryCardsProps {
  income: number;
  expense: number;
  investment: number;
  saldoBulanIni: number;
  totalSaving: number;
  excessFunMoney: number;
}

export function SummaryCards({
  income,
  expense,
  investment,
  saldoBulanIni,
  totalSaving,
  excessFunMoney,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatTile label="Income" value={income} colorClassName="text-[var(--chart-income)]" />
      <StatTile label="Expense" value={expense} colorClassName="text-[var(--chart-expense)]" />
      <StatTile
        label="Investment"
        value={investment}
        colorClassName="text-[var(--chart-investment)]"
      />
      <StatTile label="Saldo Bulan Ini" value={saldoBulanIni} />
      <StatTile label="Total Saving" value={totalSaving} />
      <StatTile label="Excess Fun Money" value={excessFunMoney} />
    </div>
  );
}
