"use client";
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from 'next/link'
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const items = useQuery(api.inventory.getItems, { searchTerm: "" });
  const settings = useQuery(api.settings.getSettings);

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

      <div className="w-full max-w-md mt-6 mb-20 space-y-4">
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

    </div>
  )
}