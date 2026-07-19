"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import { createCategory, updateCategory } from "@/lib/firestore/categories";
import type { Category, CategoryType } from "@/types/category";

const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  expense: "Expense",
  income: "Income",
  investment: "Investment",
};

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["expense", "income", "investment"]),
  plannedBudget: z.coerce.number().min(0, "Must be 0 or greater"),
  notes: z.string(),
});

type CategoryFormInput = z.input<typeof categorySchema>;
type CategoryFormValues = z.output<typeof categorySchema>;

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  defaultType?: CategoryType;
  onSaved?: () => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  defaultType,
  onSaved,
}: CategoryFormDialogProps) {
  const { user } = useAuth();
  const isEditing = Boolean(category);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormInput, unknown, CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: defaultType ?? "expense",
      plannedBudget: 0,
      notes: "",
    },
  });
  const selectedType = useWatch({ control, name: "type" });

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? "",
        type: category?.type ?? defaultType ?? "expense",
        plannedBudget: category?.plannedBudget ?? 0,
        notes: category?.notes ?? "",
      });
    }
  }, [open, category, defaultType, reset]);

  async function onSubmit(values: CategoryFormValues) {
    if (!user) return;
    try {
      if (isEditing && category) {
        await updateCategory(user.uid, category.id, {
          name: values.name,
          plannedBudget: values.plannedBudget,
          notes: values.notes || null,
        });
        toast.success("Category updated");
      } else {
        await createCategory(user.uid, {
          name: values.name,
          type: values.type,
          plannedBudget: values.plannedBudget,
          notes: values.notes || null,
        });
        toast.success("Category created");
      }
      onOpenChange(false);
      onSaved?.();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit category" : "New category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="category-name">Name</FieldLabel>
              <Input id="category-name" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="category-type">Type</FieldLabel>
              <Select
                value={selectedType}
                onValueChange={(value) => value && setValue("type", value as CategoryType)}
                disabled={isEditing}
              >
                <SelectTrigger id="category-type" className="w-full">
                  <SelectValue>
                    {(value: CategoryType) => CATEGORY_TYPE_LABELS[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="category-budget">Planned budget (monthly, Rp)</FieldLabel>
              <Input
                id="category-budget"
                type="number"
                min="0"
                step="1"
                {...register("plannedBudget")}
              />
              <FieldError errors={[errors.plannedBudget]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="category-notes">Notes (optional)</FieldLabel>
              <Textarea id="category-notes" rows={3} {...register("notes")} />
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
