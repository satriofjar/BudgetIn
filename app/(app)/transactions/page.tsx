"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationControls } from "@/components/transactions/pagination-controls";
import { ExportCsvButton } from "@/components/transactions/export-csv-button";
import { TransactionDeleteDialog } from "@/components/transactions/transaction-delete-dialog";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { useTransactions } from "@/hooks/use-transactions";
import type { Transaction, TransactionFilters } from "@/types/transaction";

function defaultFilters(): TransactionFilters {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear(),
    type: null,
    categoryId: null,
    search: "",
  };
}

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const {
    transactions,
    totalCount,
    truncated,
    loading,
    page,
    totalPages,
    setPage,
    allFilteredForExport,
  } = useTransactions(filters, pageSize);

  function openCreate() {
    setEditingTransaction(undefined);
    setFormOpen(true);
  }

  function openEdit(tx: Transaction) {
    setEditingTransaction(tx);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <div className="flex items-center gap-2">
          <ExportCsvButton transactions={allFilteredForExport} />
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add transaction
          </Button>
        </div>
      </div>

      <TransactionFiltersBar filters={filters} onChange={setFilters} />

      {truncated && (
        <p className="text-sm text-muted-foreground">
          Showing the first {totalCount} matching transactions. Narrow your filters to see more
          precise results.
        </p>
      )}

      <Card>
        <CardContent className="flex flex-col gap-4">
          <TransactionTable
            transactions={transactions}
            loading={loading}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
          <PaginationControls
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>

      <TransactionFormDialog open={formOpen} onOpenChange={setFormOpen} transaction={editingTransaction} />
      <TransactionDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        transaction={deleteTarget}
      />
    </div>
  );
}
