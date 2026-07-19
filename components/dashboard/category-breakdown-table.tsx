import { TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import type { CategoryType } from "@/types/category";
import type { CategoryBreakdownRow } from "@/types/dashboard";

interface CategoryBreakdownTableProps {
  title: string;
  type: CategoryType;
  rows: CategoryBreakdownRow[];
}

export function CategoryBreakdownTable({ title, type, rows }: CategoryBreakdownTableProps) {
  const totalPlanned = rows.reduce((s, r) => s + r.planned, 0);
  const totalActual = rows.reduce((s, r) => s + r.actual, 0);
  const totalDiff = rows.reduce((s, r) => s + r.diff, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Planned</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Difference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const isBad = row.diff < 0;
                const overBudget = type === "expense" && isBad;
                return (
                  <TableRow key={row.categoryId}>
                    <TableCell className="font-medium">
                      {row.categoryName}
                      {overBudget && (
                        <Badge variant="destructive" className="ml-2 gap-1">
                          <TriangleAlert className="size-3" />
                          Over budget
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{formatRupiah(row.planned)}</TableCell>
                    <TableCell className={`text-right ${isBad ? "text-destructive font-medium" : ""}`}>
                      {formatRupiah(row.actual)}
                    </TableCell>
                    <TableCell
                      className={`text-right ${isBad ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {formatRupiah(row.diff)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{formatRupiah(totalPlanned)}</TableCell>
                <TableCell className="text-right">{formatRupiah(totalActual)}</TableCell>
                <TableCell className="text-right">{formatRupiah(totalDiff)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
