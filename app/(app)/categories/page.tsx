import { CategoryList } from "@/components/categories/category-list";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Category</h1>
      <CategoryList />
    </div>
  );
}
