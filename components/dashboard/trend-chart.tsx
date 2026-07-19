"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils/format";
import { MONTH_NAMES } from "@/lib/utils/dates";

interface TrendChartProps {
  income: number[];
  expense: number[];
  investment: number[];
}

const SHORT_MONTHS = MONTH_NAMES.map((m) => m.slice(0, 3));

function compactRupiah(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return String(value);
}

function makeEndLabel(name: string) {
  return function EndLabel(props: {
    x?: string | number;
    y?: string | number;
    index?: number;
  }) {
    const { x, y, index } = props;
    if (index !== 11 || x === undefined || y === undefined) return null;
    return (
      <text x={Number(x) + 6} y={Number(y)} dy={4} fontSize={11} fill="var(--muted-foreground)">
        {name}
      </text>
    );
  };
}

export function TrendChart({ income, expense, investment }: TrendChartProps) {
  const data = SHORT_MONTHS.map((month, i) => ({
    month,
    Income: income[i] ?? 0,
    Expense: expense[i] ?? 0,
    Investment: investment[i] ?? 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 48, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickFormatter={compactRupiah}
                width={48}
              />
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
              <Line
                type="monotone"
                dataKey="Income"
                stroke="var(--chart-income)"
                strokeWidth={2}
                dot={{ r: 3 }}
                label={makeEndLabel("Income")}
              />
              <Line
                type="monotone"
                dataKey="Expense"
                stroke="var(--chart-expense)"
                strokeWidth={2}
                dot={{ r: 3 }}
                label={makeEndLabel("Expense")}
              />
              <Line
                type="monotone"
                dataKey="Investment"
                stroke="var(--chart-investment)"
                strokeWidth={2}
                dot={{ r: 3 }}
                label={makeEndLabel("Investment")}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
