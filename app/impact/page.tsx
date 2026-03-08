"use client";

import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ImpactPage() {
  const logs = useQuery(api.inventory.getWasteLogs);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getLogStyle = (action: string) => {
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

  const totalLogs = logs?.length || 0;
  const wastedItems = logs?.filter(l => l.action === "expired").reduce((acc, curr) => acc + curr.quantity, 0) || 0;
  const goodItems = logs?.filter(l => l.action !== "expired").reduce((acc, curr) => acc + curr.quantity, 0) || 0;

  return (
    <div className="bg-[#f6f8f7] dark:bg-[#102218] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display px-6 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Impact Timeline</h1>
        <p className="text-slate-500 dark:text-slate-400">Track how your inventory is utilized over time.</p>
      </header>

      {logs === undefined ? (
        <div className="flex justify-center p-8">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11d462]"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-1/3 space-y-4">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">All-Time Statistics</h3>
               <div className="space-y-4">
                 <div>
                   <p className="text-sm text-slate-500">Total Items Processed</p>
                   <p className="text-2xl font-bold">{goodItems + wastedItems}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800/50">
                     <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Used / Donated</p>
                     <p className="text-xl font-bold text-green-700 dark:text-[#11d462]">{goodItems}</p>
                   </div>
                   <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/50">
                     <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Expired / Wasted</p>
                     <p className="text-xl font-bold text-red-700 dark:text-red-400">{wastedItems}</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="flex-1">
            {logs.length === 0 ? (
              <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <span className="material-symbols-outlined text-4xl mb-3 text-slate-300 dark:text-slate-600 block">history</span>
                 <p className="text-slate-500">No utilization logs found. Start managing items in your inventory to build a timeline!</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8 pb-12">
                {logs.map((log) => {
                  const style = getLogStyle(log.action);
                  return (
                    <div key={log._id} className="relative pl-8">
                      <div className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full flex items-center justify-center border-4 border-[#f6f8f7] dark:border-[#102218] ${style.bg} ${style.color}`}>
                        <span className="material-symbols-outlined text-sm">{style.icon}</span>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <h4 className="font-bold text-lg text-slate-900 dark:text-white">{log.itemName}</h4>
                          <span className="text-xs font-medium text-slate-400">{formatTime(log.loggedAt)}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Marked <span className="font-bold">{log.quantity} units</span> as <span className={`font-semibold capitalize ${style.color}`}>{log.action}</span>.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
