"use client";

import { format } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { downloadCsv, toCsv } from "@/lib/utils/csv";
import { formatRupiah } from "@/lib/utils/format";
import type { Transaction } from "@/types/transaction";

interface ExportCsvButtonProps {
  transactions: Transaction[];
}

export function ExportCsvButton({ transactions }: ExportCsvButtonProps) {
  const { categories } = useCategories();

  function handleExport() {
    const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";
    const rows = transactions.map((tx) => [
      format(new Date(tx.date), "yyyy-MM-dd"),
      tx.type,
      categoryName(tx.categoryId),
      tx.description,
      formatRupiah(tx.amount),
    ]);
    const csv = toCsv(["Date", "Type", "Category", "Description", "Amount"], rows);
    downloadCsv(`budgetin-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`, csv);
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={transactions.length === 0}>
      <Download className="size-4" />
      Export CSV
    </Button>
  );
}
