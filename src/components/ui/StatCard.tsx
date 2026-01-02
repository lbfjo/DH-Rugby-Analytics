import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 md:mt-1">
            {value}
          </p>
          {subtitle && (
            <p
              className={cn("text-xs md:text-sm mt-0.5 md:mt-1 truncate", {
                "text-green-600": trend === "up",
                "text-red-600": trend === "down",
                "text-gray-500": trend === "neutral" || !trend,
              })}
            >
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-gray-400 dark:text-gray-500 ml-2 hidden sm:block">{icon}</div>
        )}
      </div>
    </div>
  );
}
