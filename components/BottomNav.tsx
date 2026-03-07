"use client";

import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-primary/10 px-6 py-3 flex justify-between items-center z-50">

      <Link href="/inventory" className="flex flex-col items-center text-primary">
        <span className="material-symbols-outlined">inventory_2</span>
        <span className="text-[10px] mt-1 font-medium">Inventory</span>
      </Link>

      <Link href="/impact" className="flex flex-col items-center text-slate-400">
        <span className="material-symbols-outlined">analytics</span>
        <span className="text-[10px] mt-1 font-medium">Impact</span>
      </Link>

      <Link href="/alerts" className="flex flex-col items-center text-slate-400">
        <span className="material-symbols-outlined">notifications</span>
        <span className="text-[10px] mt-1 font-medium">Alerts</span>
      </Link>

      <Link href="/settings" className="flex flex-col items-center text-slate-400">
        <span className="material-symbols-outlined">settings</span>
        <span className="text-[10px] mt-1 font-medium">Settings</span>
      </Link>

    </nav>
  );
}