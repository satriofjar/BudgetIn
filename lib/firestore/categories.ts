import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Category, CategoryInput } from "@/types/category";

function categoriesRef(userId: string) {
  return collection(db, "users", userId, "categories");
}

function categoryDocRef(userId: string, categoryId: string) {
  return doc(db, "users", userId, "categories", categoryId);
}

function toMillis(value: unknown): number {
  return value instanceof Timestamp ? value.toMillis() : 0;
}

export function subscribeCategories(
  userId: string,
  onChange: (categories: Category[]) => void
) {
  const q = query(categoriesRef(userId), orderBy("name"));
  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        type: data.type,
        plannedBudget: data.plannedBudget,
        notes: data.notes ?? null,
        transactionCount: data.transactionCount ?? 0,
        createdAt: toMillis(data.createdAt),
        updatedAt: toMillis(data.updatedAt),
      } satisfies Category;
    });
    onChange(categories);
  });
}

export async function createCategory(userId: string, input: CategoryInput) {
  const ref = doc(categoriesRef(userId));
  await setDoc(ref, {
    name: input.name,
    type: input.type,
    plannedBudget: input.plannedBudget,
    notes: input.notes,
    transactionCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCategory(
  userId: string,
  categoryId: string,
  input: Pick<CategoryInput, "name" | "plannedBudget" | "notes">
) {
  await updateDoc(categoryDocRef(userId, categoryId), {
    name: input.name,
    plannedBudget: input.plannedBudget,
    notes: input.notes,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(userId: string, categoryId: string) {
  await deleteDoc(categoryDocRef(userId, categoryId));
}
