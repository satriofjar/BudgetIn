"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MONTH_NAMES } from "@/lib/utils/dates";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 4 + i);

interface PeriodPickerProps {
  view: "monthly" | "yearly";
  onViewChange: (view: "monthly" | "yearly") => void;
  year: number;
  month: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

export function PeriodPicker({
  view,
  onViewChange,
  year,
  month,
  onYearChange,
  onMonthChange,
}: PeriodPickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tabs value={view} onValueChange={(v) => v && onViewChange(v as "monthly" | "yearly")}>
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>

      {view === "monthly" && (
        <Select value={String(month)} onValueChange={(v) => v && onMonthChange(Number(v))}>
          <SelectTrigger className="w-36">
            <SelectValue>{(value: string) => MONTH_NAMES[Number(value)]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {MONTH_NAMES.map((name, i) => (
              <SelectItem key={name} value={String(i)}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={String(year)} onValueChange={(v) => v && onYearChange(Number(v))}>
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {YEAR_OPTIONS.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
