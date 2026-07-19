import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils/format";
import { MONTH_NAMES } from "@/lib/utils/dates";
import type { YearlyTypeTable } from "@/types/dashboard";

const SHORT_MONTHS = MONTH_NAMES.map((m) => m.slice(0, 3));

interface YearlyTableProps {
  title: string;
  table: YearlyTypeTable;
}

export function YearlyTable({ title, table }: YearlyTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {table.categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-card">Category</TableHead>
                {SHORT_MONTHS.map((m) => (
                  <TableHead key={m} className="text-right">
                    {m}
                  </TableHead>
                ))}
                <TableHead className="text-right font-semibold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.categories.map((cat) => {
                const catYearTotal = table.months.reduce(
                  (s, m) => s + (m.categoryTotals[cat.id] ?? 0),
                  0
                );
                return (
                  <TableRow key={cat.id}>
                    <TableCell className="sticky left-0 bg-card font-medium">{cat.name}</TableCell>
                    {table.months.map((m) => (
                      <TableCell key={m.month} className="text-right">
                        {formatRupiah(m.categoryTotals[cat.id] ?? 0)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-semibold">
                      {formatRupiah(catYearTotal)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="sticky left-0 bg-card">Total</TableCell>
                {table.monthlyTotals.map((total, i) => (
                  <TableCell key={i} className="text-right">
                    {formatRupiah(total)}
                  </TableCell>
                ))}
                <TableCell className="text-right">{formatRupiah(table.yearTotal)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
