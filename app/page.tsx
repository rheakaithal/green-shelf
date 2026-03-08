"use client";
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from 'next/link'
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot } from 'recharts';

export default function Home() {
  const items = useQuery(api.inventory.getItems, { searchTerm: "" });
  const settings = useQuery(api.settings.getSettings);
  const logs = useQuery(api.inventory.getWasteLogs);

  // AI & Graph State
  const generateInsight = useAction(api.ai.generateWasteInsight);
  const generateItemInsight = useAction(api.ai.generateItemInsight);
  const [insight, setInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  const isLowStock = (item: any) => {
    if (!settings) return false;
    const threshold = item.customLowStockThreshold !== undefined ? item.customLowStockThreshold : settings.lowStockThreshold;
    return item.quantity <= threshold;
  };

  const isExpiringSoon = (item: any) => {
    if (!settings || !item.expirationDate) return false;
    const expDate = new Date(item.expirationDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= settings.expiringSoonDays;
  };

  const lowStockCount = items && settings ? items.filter(isLowStock).length : "...";
  const expiringSoonCount = items && settings ? items.filter(isExpiringSoon).length : "...";

  // Reconstruct Stock History for Graph
  const uniqueItemNames = Array.from(new Set([
    ...(logs?.map(l => l.itemName) || []),
    ...(items?.map(i => i.name) || [])
  ])).sort();

  let chartData: any[] = [];
  if (selectedItemName && logs && items) {
    const itemLogs = [...logs].filter(l => l.itemName === selectedItemName).sort((a: any, b: any) => a.loggedAt - b.loggedAt);
    const currentItem = items.find(i => i.name === selectedItemName);
    
    // Walk backwards from current stock to determine historical points
    let currentCalculatedQuantity = currentItem ? currentItem.quantity : 0;
    
    // Final point is right now
    chartData.push({
       date: 'Now',
       timestamp: Date.now(),
       quantity: currentCalculatedQuantity,
       action: 'current'
    });

    // Walk backwards through sorted logs (newest first for math)
    const reversedLogs = [...itemLogs].reverse();
    for (const log of reversedLogs) {
      currentCalculatedQuantity += log.quantity;
      const d = new Date(log.loggedAt);
      chartData.unshift({
        date: `${d.getMonth()+1}/${d.getDate()}`,
        timestamp: log.loggedAt,
        quantity: currentCalculatedQuantity,
        action: log.action,
        depletionSize: log.quantity
      });
    }
  }

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.action === 'expired') {
      return (
        <svg x={cx - 6} y={cy - 6} width={12} height={12} fill="red" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
    }
    return <Dot cx={cx} cy={cy} r={4} fill="#11d462" stroke="#fff" strokeWidth={2} />;
  };

  const handleGenerateInsight = async () => {
    setIsGenerating(true);
    setInsight(null);
    try {
      if (selectedItemName) {
         const result = await generateItemInsight({ itemName: selectedItemName });
         setInsight(result as string);
      } else {
         const result = await generateInsight();
         setInsight(result as string);
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      setInsight("AI Service is temporarily unavailable. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7] flex flex-col items-center px-6 pt-16">

      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your inventory
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">

        <Link href="/inventory?filter=LOW_STOCK" className="w-full">
          <Card className="rounded-2xl shadow-sm hover:border-[#11d462] hover:bg-[#11d462]/5 transition-all cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center">
              <p className="text-5xl font-bold text-slate-900 dark:text-slate-100">{lowStockCount}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1 text-center">
                Low Stock
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inventory?filter=EXPIRING_SOON" className="w-full">
          <Card className="rounded-2xl shadow-sm hover:border-red-500 hover:bg-red-500/5 transition-all cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center">
              <p className="text-5xl font-bold text-slate-900 dark:text-slate-100">{expiringSoonCount}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1 text-center">
                Expiring Soon
              </p>
            </CardContent>
          </Card>
        </Link>

      </div>
      
      <div className="w-full max-w-md mt-6 mb-8 space-y-4">
        <Button
          variant="outline"
          asChild
          className="group w-full h-14 rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#11d462] hover:bg-[#11d462]/5 hover:text-[#11d462] transition-all shadow-sm"
        >
          <Link href="/inventory" className="block w-full">
            Check on your inventory
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
          </Link>
        </Button>

        <Button
          variant="outline"
          asChild
          className="group w-full h-14 rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#11d462] hover:bg-[#11d462]/5 hover:text-[#11d462] transition-all shadow-sm"
        >
          <Link href="/impact" className="block w-full">
            Evaluate your impact
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
          </Link>
        </Button>
      </div>

      {/* Item History Graph & AI Analytics */}
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-20 mt-2">
        <div className="flex flex-col mb-6 gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
           <div>
             <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
               <span className="material-symbols-outlined text-[#11d462]">auto_awesome</span>
               Quick Look
             </h2>
             <p className="text-sm text-slate-500 mt-1">Select an item to view its stock history and generate targeted insights.</p>
           </div>
           
           <select 
             value={selectedItemName}
             onChange={(e) => {
               setSelectedItemName(e.target.value);
               setInsight(null);
             }}
             className="form-select bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-[#11d462] focus:border-[#11d462] w-full font-medium"
           >
             <option value="">Overall Inventory</option>
             {uniqueItemNames.map(name => (
               <option key={name} value={name}>{name}</option>
             ))}
           </select>
        </div>

        {selectedItemName && (
          <div className="mb-8 w-full h-[250px] border border-slate-100 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/20">
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                  <YAxis tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dx={-10} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                     formatter={(value, name, props) => {
                        const actionStr = props.payload.action !== 'current' ? ` (${props.payload.depletionSize} ${props.payload.action})` : '';
                        return [`${value} in stock${actionStr}`, 'Quantity'];
                     }}
                  />
                  <Line type="stepAfter" dataKey="quantity" stroke="#11d462" strokeWidth={3} dot={<CustomDot />} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">show_chart</span>
                <p className="text-sm text-center px-4">Not enough history to graph this item yet.</p>
              </div>
            )}
            <div className="flex justify-center items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#11d462]"></div> Stock</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Wasted</div>
            </div>
          </div>
        )}

        {insight ? (
          <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-br from-[#11d462]/10 to-transparent dark:from-[#11d462]/10 dark:to-transparent relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <CardContent className="p-4 relative z-10">
              <div className="flex gap-4 items-start">
                <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm shrink-0 text-[#11d462] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">psychiatry</span>
                </div>
                <div className="space-y-3 pt-0.5 w-full">
                  {insight.split('\n').map((paragraph, idx) => {
                    const cleanParagraph = paragraph.trim();
                    if (!cleanParagraph) return null;
                    
                    if (cleanParagraph.toLowerCase().startsWith('recommendation:')) {
                      return (
                         <div key={idx} className="mt-4 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-[#11d462]/20 shadow-sm">
                           <span className="font-bold tracking-widest text-[#11d462] uppercase text-[10px] mb-1.5 block">Recommendation</span>
                           <span className="text-slate-800 dark:text-slate-200 font-medium text-xs md:text-sm">{cleanParagraph.replace(/^recommendation:\s*/i, '')}</span>
                         </div>
                      );
                    }
                    if (cleanParagraph.toLowerCase() === 'ai insight') return null;
                    return (
                      <p key={idx} className="text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {cleanParagraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-transparent">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">analytics</span>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                {selectedItemName 
                  ? `AI analysis for ${selectedItemName} trends.`
                  : "Generate a smart recommendation based on your entire usage history."}
              </p>
              <Button 
                onClick={handleGenerateInsight}
                disabled={isGenerating || logs === undefined}
                className="bg-[#11d462] w-full hover:bg-[#11d462]/90 text-white rounded-xl shadow-sm px-6 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isGenerating ? "Analyzing Data..." : (selectedItemName ? 'Quick Look' : 'Generate Global Insight')}
              </Button>
          </div>
        )}
      </div>

    </div>
  )
}