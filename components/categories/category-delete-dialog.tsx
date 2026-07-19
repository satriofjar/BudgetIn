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
import { deleteCategory } from "@/lib/firestore/categories";
import type { Category } from "@/types/category";

interface CategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onDeleted?: () => void;
}

export function CategoryDeleteDialog({
  open,
  onOpenChange,
  category,
  onDeleted,
}: CategoryDeleteDialogProps) {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const inUse = (category?.transactionCount ?? 0) > 0;

  async function handleDelete() {
    if (!user || !category) return;
    setDeleting(true);
    try {
      await deleteCategory(user.uid, category.id);
      toast.success("Category deleted");
      onOpenChange(false);
      onDeleted?.();
    } catch {
      toast.error(
        `This category is used in ${category.transactionCount} transaction${
          category.transactionCount === 1 ? "" : "s"
        } and can't be deleted.`
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category</AlertDialogTitle>
          <AlertDialogDescription>
            {inUse
              ? `"${category?.name}" is used in ${category?.transactionCount} transaction${
                  category?.transactionCount === 1 ? "" : "s"
                } and can't be deleted. Remove or reassign those transactions first.`
              : `Are you sure you want to delete "${category?.name}"? This can't be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {!inUse && (
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
