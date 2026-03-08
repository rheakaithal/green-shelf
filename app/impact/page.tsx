"use client";

import React, { useState } from 'react';
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTime, getLogStyle } from "@/lib/utils";

export default function ImpactPage() {
  const logs = useQuery(api.inventory.getWasteLogs);
  const [logFilter, setLogFilter] = useState<"ALL" | "USED_DONATED" | "EXPIRED">("ALL");

  const totalLogs = logs?.length || 0;
  const wastedItems = logs?.filter(l => l.action === "expired").reduce((acc, curr) => acc + curr.quantity, 0) || 0;
  const goodItems = logs?.filter(l => l.action !== "expired").reduce((acc, curr) => acc + curr.quantity, 0) || 0;

  const filteredLogs = logs?.filter(log => {
    if (logFilter === "ALL") return true;
    if (logFilter === "EXPIRED") return log.action === "expired";
    if (logFilter === "USED_DONATED") return log.action !== "expired";
    return true;
  });

  const generateInsight = useAction(api.ai.generateWasteInsight);
  const [insight, setInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsight = async () => {
    setIsGenerating(true);
    try {
      const result = await generateInsight();
      setInsight(result as string);
    } catch (error) {
      console.error("AI Generation failed, using rule-based fallback:", error);
      
      // Basic rule-based fallback logic
      if (!logs || logs.length === 0) {
        setInsight("Not enough data to generate a recommendation yet. Keep logging your inventory usage!");
      } else {
        // Find most wasted item
        const wastedCounts: Record<string, number> = {};
        const usedCounts: Record<string, number> = {};
        
        logs.forEach(log => {
          if (log.action === "expired") {
            wastedCounts[log.itemName] = (wastedCounts[log.itemName] || 0) + log.quantity;
          } else if (log.action === "fully used") {
            usedCounts[log.itemName] = (usedCounts[log.itemName] || 0) + log.quantity;
          }
        });

        let mostWastedItem = "";
        let maxWaste = 0;
        for (const [item, count] of Object.entries(wastedCounts)) {
          if (count > maxWaste) {
            maxWaste = count;
            mostWastedItem = item;
          }
        }

        if (mostWastedItem) {
          setInsight(`We noticed you recently had to throw away ${maxWaste} units of ${mostWastedItem}.\n\nRECOMMENDATION: Consider reducing your regular order size for ${mostWastedItem} to prevent future waste.`);
        } else {
          // If no waste, find most used item
          let mostUsedItem = "";
          let maxUsed = 0;
          for (const [item, count] of Object.entries(usedCounts)) {
            if (count > maxUsed) {
              maxUsed = count;
              mostUsedItem = item;
            }
          }
          
          if (mostUsedItem) {
            setInsight(`Great job! You have zero recorded waste recently. You frequently use ${mostUsedItem} (${maxUsed} units logged).\n\nRECOMMENDATION: Consider buying ${mostUsedItem} in bulk to save money since your usage rate is high.`);
          } else {
            setInsight(`You're doing great with your inventory tracking.\n\nRECOMMENDATION: Wait a few more days to accumulate data for deeper insights.`);
          }
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

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
          
          <div className="w-full md:w-1/3 space-y-8">

             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">All-Time Statistics</h3>
               <div className="space-y-4">
                 <button 
                  onClick={() => setLogFilter("ALL")}
                  className={`w-full text-left transition-all ${logFilter === 'ALL' ? 'opacity-100 scale-[1.02]' : 'opacity-70 hover:opacity-100'}`}
                 >
                   <p className="text-sm text-slate-500">Total Items Processed</p>
                   <p className="text-2xl font-bold">{goodItems + wastedItems}</p>
                 </button>
                 <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={() => setLogFilter("USED_DONATED")}
                     className={`text-left bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border transition-all ${logFilter === 'USED_DONATED' ? 'border-green-400 dark:border-green-500 ring-1 ring-green-400 scale-[1.02] shadow-sm' : 'border-green-100 dark:border-green-800/50 hover:border-green-300'}`}
                   >
                     <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Used / Donated</p>
                     <p className="text-xl font-bold text-green-700 dark:text-[#11d462]">{goodItems}</p>
                   </button>
                   <button 
                     onClick={() => setLogFilter("EXPIRED")}
                     className={`text-left bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border transition-all ${logFilter === 'EXPIRED' ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400 scale-[1.02] shadow-sm' : 'border-red-100 dark:border-red-800/50 hover:border-red-300'}`}
                   >
                     <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Expired / Wasted</p>
                     <p className="text-xl font-bold text-red-700 dark:text-red-400">{wastedItems}</p>
                   </button>
                 </div>
               </div>
             </div>

            {/* AI Insight Section */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#11d462]">auto_awesome</span>
                  Smart Recommendations
                </h2>
              </div>

              {insight ? (
                <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-br from-[#11d462]/10 to-transparent dark:from-[#11d462]/10 dark:to-transparent relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#11d462]/20 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex gap-4 items-start">
                      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm shrink-0 text-[#11d462] flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">psychiatry</span>
                      </div>
                      <div className="space-y-3 pt-1 w-full">
                        {insight.split('\n').map((paragraph, idx) => {
                          const cleanParagraph = paragraph.trim();
                          if (!cleanParagraph) return null;
                          
                          if (cleanParagraph.toLowerCase().startsWith('recommendation:')) {
                            return (
                               <div key={idx} className="mt-5 bg-white/70 dark:bg-slate-900/60 p-4 rounded-xl border border-[#11d462]/20 shadow-sm">
                                 <span className="font-bold tracking-widest text-[#11d462] uppercase text-[10px] mb-1.5 block">Actionable Recommendation</span>
                                 <span className="text-slate-800 dark:text-slate-200 font-medium text-sm">{cleanParagraph.replace(/^recommendation:\s*/i, '')}</span>
                               </div>
                            );
                          }
                          
                          if (cleanParagraph.toLowerCase() === 'ai insight') return null;
                          
                          return (
                            <p key={idx} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                              {cleanParagraph}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 border-dashed bg-transparent">
                  <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3">analytics</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Generate a smart recommendation based on your usage history to discover ways to reduce waste and save money.
                    </p>
                    <Button 
                      onClick={handleGenerateInsight}
                      disabled={isGenerating}
                      className="mt-4 bg-[#11d462] hover:bg-[#11d462]/90 text-white rounded-xl shadow-sm px-6"
                    >
                      {isGenerating ? "Analyzing..." : "Generate Recommendation"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>

          <div className="flex-1">
            {filteredLogs?.length === 0 ? (
              <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <span className="material-symbols-outlined text-4xl mb-3 text-slate-300 dark:text-slate-600 block">history</span>
                 <p className="text-slate-500">No utilization logs found matching this filter.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8 pb-12">
                {filteredLogs?.map((log) => {
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
