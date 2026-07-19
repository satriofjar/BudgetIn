"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { Category, CategoryType } from "@/types/category";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { CategoryFormDialog } from "./category-form-dialog";

const TYPE_SECTIONS: { type: CategoryType; label: string }[] = [
  { type: "expense", label: "Expense" },
  { type: "income", label: "Income" },
  { type: "investment", label: "Investment" },
];

export function CategoryList() {
  const { categories, loading } = useCategories();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [createType, setCreateType] = useState<CategoryType>("expense");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  function openCreate(type: CategoryType) {
    setEditingCategory(undefined);
    setCreateType(type);
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      {TYPE_SECTIONS.map(({ type, label }) => {
        const items = categories.filter((c) => c.type === type);
        return (
          <Card key={type}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{label}</CardTitle>
              <Button size="sm" variant="outline" onClick={() => openCreate(type)}>
                <Plus className="size-4" />
                Add {label.toLowerCase()} category
              </Button>
            </CardHeader>
            <CardContent>
              {!loading && items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No {label.toLowerCase()} categories yet.
                </p>
              )}
              {items.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Planned budget</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="w-24 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.name}
                          {category.transactionCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {category.transactionCount} tx
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatRupiah(category.plannedBudget)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {category.notes || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEdit(category)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteTarget(category)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        );
      })}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        defaultType={createType}
      />
      <CategoryDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        category={deleteTarget}
      />
    </div>
  );
}
