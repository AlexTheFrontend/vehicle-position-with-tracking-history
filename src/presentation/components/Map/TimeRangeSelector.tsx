"use client";

import type { TimeRange } from "@/domain/types";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "now-1h", label: "1h" },
  { value: "now-6h", label: "6h" },
  { value: "now-24h", label: "24h" },
  { value: "now-7d", label: "7d" },
];

export const TimeRangeSelector = ({
  value,
  onChange,
}: TimeRangeSelectorProps) => {
  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
      <span className="text-sm text-gray-600 font-medium">Track:</span>
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            value === range.value
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

