import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils/format";
import { MONTH_NAMES } from "@/lib/utils/dates";

const SHORT_MONTHS = MONTH_NAMES.map((m) => m.slice(0, 3));

interface YearlySavingsSummaryProps {
  totalSavingByMonth: number[];
  excessFunMoneyByMonth: number[];
  totalSavingYear: number;
  excessFunMoneyYear: number;
}

export function YearlySavingsSummary({
  totalSavingByMonth,
  excessFunMoneyByMonth,
  totalSavingYear,
  excessFunMoneyYear,
}: YearlySavingsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saving &amp; excess fun money</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-card">Metric</TableHead>
              {SHORT_MONTHS.map((m) => (
                <TableHead key={m} className="text-right">
                  {m}
                </TableHead>
              ))}
              <TableHead className="text-right font-semibold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="sticky left-0 bg-card font-medium">Total Saving</TableCell>
              {totalSavingByMonth.map((v, i) => (
                <TableCell key={i} className="text-right">
                  {formatRupiah(v)}
                </TableCell>
              ))}
              <TableCell className="text-right font-semibold">
                {formatRupiah(totalSavingYear)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="sticky left-0 bg-card font-medium">Excess Fun Money</TableCell>
              {excessFunMoneyByMonth.map((v, i) => (
                <TableCell key={i} className="text-right">
                  {formatRupiah(v)}
                </TableCell>
              ))}
              <TableCell className="text-right font-semibold">
                {formatRupiah(excessFunMoneyYear)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
