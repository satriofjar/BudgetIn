"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils/format";
import type { CategoryBreakdownRow } from "@/types/dashboard";

const SLICE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const MAX_SLICES = 4;

interface ExpensePieChartProps {
  rows: CategoryBreakdownRow[];
}

export function ExpensePieChart({ rows }: ExpensePieChartProps) {
  const withSpend = rows.filter((r) => r.actual > 0).sort((a, b) => b.actual - a.actual);
  const top = withSpend.slice(0, MAX_SLICES);
  const rest = withSpend.slice(MAX_SLICES);
  const otherTotal = rest.reduce((s, r) => s + r.actual, 0);

  const data = [
    ...top.map((r) => ({ name: r.categoryName, value: r.actual })),
    ...(otherTotal > 0 ? [{ name: "Other", value: otherTotal }] : []),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense composition</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expenses recorded this month.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={SLICE_COLORS[index % SLICE_COLORS.length]}
                      stroke="var(--card)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatRupiah(Number(value))}
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    color: "var(--popover-foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
