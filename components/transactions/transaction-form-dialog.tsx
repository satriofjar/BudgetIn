"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import { useDataRefresh } from "@/context/data-refresh-context";
import { useCategoriesByType } from "@/hooks/use-categories";
import { createTransaction, updateTransaction } from "@/lib/firestore/transactions";
import type { CategoryType } from "@/types/category";
import type { Transaction } from "@/types/transaction";

const TYPE_LABELS: Record<CategoryType, string> = {
  expense: "Expense",
  income: "Income",
  investment: "Investment",
};

const transactionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  type: z.enum(["expense", "income", "investment"]),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
});

type TransactionFormInput = z.input<typeof transactionSchema>;
type TransactionFormValues = z.output<typeof transactionSchema>;

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  defaultType?: CategoryType;
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  defaultType,
}: TransactionFormDialogProps) {
  const { user } = useAuth();
  const { bump } = useDataRefresh();
  const isEditing = Boolean(transaction);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormInput, unknown, TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      type: defaultType ?? "expense",
      categoryId: "",
      description: "",
      amount: 0,
    },
  });

  const selectedType = useWatch({ control, name: "type" });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const { categories } = useCategoriesByType(selectedType as CategoryType);

  useEffect(() => {
    if (open) {
      reset({
        date: format(new Date(transaction?.date ?? Date.now()), "yyyy-MM-dd"),
        type: transaction?.type ?? defaultType ?? "expense",
        categoryId: transaction?.categoryId ?? "",
        description: transaction?.description ?? "",
        amount: transaction?.amount ?? 0,
      });
    }
  }, [open, transaction, defaultType, reset]);

  function handleTypeChange(value: string | null) {
    if (!value) return;
    setValue("type", value as CategoryType);
    setValue("categoryId", "");
  }

  async function onSubmit(values: TransactionFormValues) {
    if (!user) return;
    const input = {
      date: new Date(`${values.date}T00:00:00`).getTime(),
      type: values.type,
      categoryId: values.categoryId,
      description: values.description,
      amount: values.amount,
    };
    try {
      if (isEditing && transaction) {
        await updateTransaction(user.uid, transaction.id, transaction.categoryId, input);
        toast.success("Transaction updated");
      } else {
        await createTransaction(user.uid, input);
        toast.success("Transaction added");
      }
      bump();
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit transaction" : "New transaction"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="tx-date">Date</FieldLabel>
              <Input id="tx-date" type="date" {...register("date")} />
              <FieldError errors={[errors.date]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="tx-type">Type</FieldLabel>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger id="tx-type" className="w-full">
                  <SelectValue>
                    {(value: CategoryType) => TYPE_LABELS[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="tx-category">Category</FieldLabel>
              <Select
                value={selectedCategoryId}
                onValueChange={(v) => v && setValue("categoryId", v)}
              >
                <SelectTrigger id="tx-category" className="w-full">
                  <SelectValue placeholder="Select a category">
                    {(value: string) => categories.find((c) => c.id === value)?.name ?? value}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No {TYPE_LABELS[selectedType as CategoryType]?.toLowerCase()} categories yet —
                  create one first on the Category page.
                </p>
              )}
              <FieldError errors={[errors.categoryId]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="tx-description">Description</FieldLabel>
              <Input id="tx-description" {...register("description")} />
              <FieldError errors={[errors.description]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="tx-amount">Amount (Rp)</FieldLabel>
              <Input id="tx-amount" type="number" min="0" step="1" {...register("amount")} />
              <FieldError errors={[errors.amount]} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
