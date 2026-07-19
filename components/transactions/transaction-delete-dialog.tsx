"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/auth-context";
import { useDataRefresh } from "@/context/data-refresh-context";
import { deleteTransaction } from "@/lib/firestore/transactions";
import type { Transaction } from "@/types/transaction";

interface TransactionDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export function TransactionDeleteDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionDeleteDialogProps) {
  const { user } = useAuth();
  const { bump } = useDataRefresh();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!user || !transaction) return;
    setDeleting(true);
    try {
      await deleteTransaction(user.uid, transaction.id, transaction.categoryId);
      toast.success("Transaction deleted");
      bump();
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{transaction?.description}&quot;? This can&apos;t
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
