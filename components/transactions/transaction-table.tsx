"use client";

import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/use-categories";
import { formatRupiah } from "@/lib/utils/format";
import type { CategoryType } from "@/types/category";
import type { Transaction } from "@/types/transaction";

const TYPE_VARIANTS: Record<CategoryType, string> = {
  income: "text-emerald-600 dark:text-emerald-400",
  expense: "text-destructive",
  investment: "text-blue-600 dark:text-blue-400",
};

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionTable({
  transactions,
  loading,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const { categories } = useCategories();
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  if (!loading && transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No transactions found for the current filters.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-24 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>{format(new Date(tx.date), "dd MMM yyyy")}</TableCell>
            <TableCell>
              <Badge variant="outline">{categoryName(tx.categoryId)}</Badge>
            </TableCell>
            <TableCell>{tx.description}</TableCell>
            <TableCell className={`text-right font-medium ${TYPE_VARIANTS[tx.type]}`}>
              {formatRupiah(tx.amount)}
            </TableCell>
            <TableCell className="text-right">
              <Button size="icon" variant="ghost" onClick={() => onEdit(tx)}>
                <Pencil className="size-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(tx)}>
                <Trash2 className="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
