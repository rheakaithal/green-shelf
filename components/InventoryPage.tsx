
"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from 'next/link';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Items");

  const items = useQuery(api.inventory.getItems, {
    searchTerm,
    category,
  });

  const deleteItem = useMutation(api.inventory.deleteItem);

  const handleDelete = (id: any) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItem({ id });
    }
  };

  return (
    <>


      <div className="bg-[#f6f8f7] dark:bg-[#102218] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
        <header className="sticky top-0 z-10 bg-[#f6f8f7]/80 dark:bg-[#102218]/80 backdrop-blur-md px-4 pt-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#11d462]/20 p-2 rounded-lg">
                <span className="material-symbols-outlined text-[#11d462]">eco</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">EcoInventory</h1>
            </div>
            <button className="relative p-2 rounded-full hover:bg-[#11d462]/10 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-[#11d462]"></span>
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                className="w-full bg-white dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#11d462] text-sm shadow-sm" 
                placeholder="Search green assets..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-[#11d462]/10 text-[#11d462] p-3 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
          <div className="flex gap-2 mt-4 pb-2 overflow-x-auto no-scrollbar">
            {["All Items", "Energy", "Lighting", "Recycled", "Eco-friendly", "Renewable", "Organic"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`${category === cat ? 'bg-[#11d462] text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border border-slate-200 dark:border-slate-700 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>
        <main className="flex-1 px-4 py-2 space-y-4">
          {items === undefined ? (
            <div className="flex justify-center p-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11d462]"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center p-8 text-slate-500">
               <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inventory_2</span>
               <p>No items found.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4 relative group">
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-50 dark:bg-red-900/20 rounded-md"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                <div className="w-20 h-20 rounded-lg bg-[#11d462]/5 flex items-center justify-center shrink-0 bg-cover bg-center text-[#11d462]">
                  <span className="material-symbols-outlined text-3xl">deployed_code</span>
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base truncate">{item.name}</h3>
                    {item.stockStatus && (
                      <span className={`${item.stockStatus === 'Low Stock' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-[#11d462]/10 text-[#11d462]'} text-[10px] font-bold px-2 py-0.5 rounded uppercase`}>
                        {item.stockStatus}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                       <span className="material-symbols-outlined text-xs">inventory_2</span>
                       <span>Stock: {item.quantity} units</span>
                    </div>
                    {item.location && <span>Loc: {item.location}</span>}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#11d462] text-sm">energy_savings_leaf</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Score: {item.score ?? 'N/A'}/100</span>
                    </div>
                    <div className="flex h-1.5 w-16 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="bg-[#11d462] h-full" style={{ width: `${item.score ?? 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div className="h-20"></div> {/* Spacer for FAB */}
        </main>
        {/* Floating Action Button */}
        <Link href="/add" className="fixed bottom-24 right-6 bg-[#11d462] text-white size-14 rounded-full shadow-lg shadow-[#11d462]/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-20">
          <span className="material-symbols-outlined text-3xl">add</span>
        </Link>
        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 py-3 z-10">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <a className="flex flex-col items-center gap-1 text-[#11d462]" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warehouse</span>
              <span className="text-[10px] font-bold">Inventory</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#11d462] transition-colors" href="#">
              <span className="material-symbols-outlined">analytics</span>
              <span className="text-[10px] font-medium">Analytics</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#11d462] transition-colors" href="#">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="text-[10px] font-medium">Orders</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#11d462] transition-colors" href="#">
              <span className="material-symbols-outlined">account_circle</span>
              <span className="text-[10px] font-medium">Profile</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}