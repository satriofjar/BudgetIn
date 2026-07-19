import {
  collection,
  doc,
  getAggregateFromServer,
  getDocs,
  increment,
  limit as limitFn,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  sum,
  Timestamp,
  where,
  writeBatch,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { CategoryType } from "@/types/category";
import type { Transaction, TransactionInput } from "@/types/transaction";

function transactionsRef(userId: string) {
  return collection(db, "users", userId, "transactions");
}

function transactionDocRef(userId: string, transactionId: string) {
  return doc(db, "users", userId, "transactions", transactionId);
}

function categoryDocRef(userId: string, categoryId: string) {
  return doc(db, "users", userId, "categories", categoryId);
}

function toMillis(value: unknown): number {
  return value instanceof Timestamp ? value.toMillis() : 0;
}

function docToTransaction(docSnap: QueryDocumentSnapshot): Transaction {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    date: toMillis(data.date),
    type: data.type,
    categoryId: data.categoryId,
    description: data.description,
    amount: data.amount,
    createdAt: toMillis(data.createdAt),
    updatedAt: toMillis(data.updatedAt),
  };
}

export interface TransactionQueryFilters {
  month: number | null;
  year: number | null;
  type: CategoryType | null;
  categoryId: string | null;
}

function buildConstraints(filters: TransactionQueryFilters): QueryConstraint[] {
  const constraints: QueryConstraint[] = [];
  if (filters.year !== null) {
    const month = filters.month ?? 0;
    const start = filters.month !== null
      ? new Date(filters.year, month, 1)
      : new Date(filters.year, 0, 1);
    const end = filters.month !== null
      ? new Date(filters.year, month + 1, 1)
      : new Date(filters.year + 1, 0, 1);
    constraints.push(where("date", ">=", Timestamp.fromDate(start)));
    constraints.push(where("date", "<", Timestamp.fromDate(end)));
  }
  if (filters.type) constraints.push(where("type", "==", filters.type));
  if (filters.categoryId) constraints.push(where("categoryId", "==", filters.categoryId));
  constraints.push(orderBy("date", "desc"));
  return constraints;
}

export async function fetchTransactionsPage(
  userId: string,
  filters: TransactionQueryFilters,
  pageSize: number,
  cursor?: QueryDocumentSnapshot
) {
  const constraints = buildConstraints(filters);
  constraints.push(limitFn(pageSize + 1));
  if (cursor) constraints.push(startAfter(cursor));

  const snap = await getDocs(query(transactionsRef(userId), ...constraints));
  const docs = snap.docs.slice(0, pageSize);
  const hasMore = snap.docs.length > pageSize;
  return {
    transactions: docs.map(docToTransaction),
    lastDoc: docs[docs.length - 1],
    hasMore,
  };
}

const SEARCH_FETCH_CAP = 5000;

export async function fetchAllTransactionsForFilters(
  userId: string,
  filters: TransactionQueryFilters,
  cap = SEARCH_FETCH_CAP
) {
  const constraints = buildConstraints(filters);
  constraints.push(limitFn(cap));
  const snap = await getDocs(query(transactionsRef(userId), ...constraints));
  return {
    transactions: snap.docs.map(docToTransaction),
    truncated: snap.docs.length >= cap,
  };
}

export async function createTransaction(userId: string, input: TransactionInput) {
  const txRef = doc(transactionsRef(userId));
  const batch = writeBatch(db);
  batch.set(txRef, {
    date: Timestamp.fromMillis(input.date),
    type: input.type,
    categoryId: input.categoryId,
    description: input.description,
    amount: input.amount,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.update(categoryDocRef(userId, input.categoryId), {
    transactionCount: increment(1),
  });
  await batch.commit();
  return txRef.id;
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  previousCategoryId: string,
  input: TransactionInput
) {
  const txRef = transactionDocRef(userId, transactionId);
  const batch = writeBatch(db);
  batch.update(txRef, {
    date: Timestamp.fromMillis(input.date),
    type: input.type,
    categoryId: input.categoryId,
    description: input.description,
    amount: input.amount,
    updatedAt: serverTimestamp(),
  });
  if (input.categoryId !== previousCategoryId) {
    batch.update(categoryDocRef(userId, input.categoryId), {
      transactionCount: increment(1),
    });
    batch.update(categoryDocRef(userId, previousCategoryId), {
      transactionCount: increment(-1),
    });
  }
  await batch.commit();
}

export async function deleteTransaction(
  userId: string,
  transactionId: string,
  categoryId: string
) {
  const batch = writeBatch(db);
  batch.delete(transactionDocRef(userId, transactionId));
  batch.update(categoryDocRef(userId, categoryId), {
    transactionCount: increment(-1),
  });
  await batch.commit();
}

export async function sumAmountBefore(
  userId: string,
  type: CategoryType,
  beforeDate: Date
) {
  const snap = await getAggregateFromServer(
    query(
      transactionsRef(userId),
      where("type", "==", type),
      where("date", "<", Timestamp.fromDate(beforeDate))
    ),
    { total: sum("amount") }
  );
  return snap.data().total ?? 0;
}

export async function sumAmountInRange(
  userId: string,
  type: CategoryType,
  start: Date,
  end: Date
) {
  const snap = await getAggregateFromServer(
    query(
      transactionsRef(userId),
      where("type", "==", type),
      where("date", ">=", Timestamp.fromDate(start)),
      where("date", "<", Timestamp.fromDate(end))
    ),
    { total: sum("amount") }
  );
  return snap.data().total ?? 0;
}

export async function fetchTransactionsInRange(userId: string, start: Date, end: Date) {
  const snap = await getDocs(
    query(
      transactionsRef(userId),
      where("date", ">=", Timestamp.fromDate(start)),
      where("date", "<", Timestamp.fromDate(end)),
      orderBy("date", "desc")
    )
  );
  return snap.docs.map(docToTransaction);
}
