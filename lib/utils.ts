import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (ts: number) => {
  const d = new Date(ts);
  return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export const getLogStyle = (action: string) => {
  switch (action) {
    case "fully used":
      return { color: "text-green-600 dark:text-[#11d462]", bg: "bg-green-100 dark:bg-green-900/40", icon: "check_circle" };
    case "donated":
      return { color: "text-green-600 dark:text-[#11d462]", bg: "bg-green-100 dark:bg-green-900/40", icon: "volunteer_activism" };
    case "expired":
      return { color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", icon: "delete_sweep" };
    default:
      return { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", icon: "info" };
  }
};
