"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function AddInventory({ onClose }: { onClose: () => void }) {
  const addItem = useMutation(api.inventory.addItem);

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [location, setLocation] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity || !location) return;

    setIsSubmitting(true);
    try {
      await addItem({
        name,
        quantity: Number(quantity),
        location,
        expirationDate: expirationDate || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to add item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
        <header className="flex items-center bg-white dark:bg-slate-900 p-4 pb-2 sticky top-0 z-10 border-b border-primary/10">
          <button type="button" onClick={onClose} aria-label="Go back" className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center hover:bg-primary/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight flex-1 ml-2">Add Inventory</h2>
          <button type="button" className="text-primary flex size-12 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined">info</span>
          </button>
        </header>

        <main className="flex flex-col w-full max-w-md mx-auto p-4 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-4">
              <div className="flex flex-col w-full">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Item Name</label>
                <input 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input flex w-full rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 p-4 text-base font-normal" 
                  placeholder="e.g. Plastic Cups" 
                  type="text" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col w-full">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Quantity</label>
                  <div className="flex items-center h-14 bg-white dark:bg-slate-900/50 border border-primary/20 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <button 
                      type="button"
                      onClick={() => setQuantity(prev => Math.max(0, (parseInt(prev) || 0) - 1).toString())}
                      className="h-full px-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
                    >
                      <span className="material-symbols-outlined text-xl">remove</span>
                    </button>
                    <input 
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ''))}
                      className="form-input flex w-full h-full text-center text-slate-900 dark:text-slate-100 bg-transparent border-none focus:ring-0 p-0 text-base font-medium" 
                      type="text" 
                      inputMode="numeric"
                    />
                    <button 
                      type="button"
                      onClick={() => setQuantity(prev => ((parseInt(prev) || 0) + 1).toString())}
                      className="h-full px-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
                    >
                      <span className="material-symbols-outlined text-xl">add</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Location</label>
                  <input 
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-input flex w-full rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 p-4 text-base font-normal" 
                    placeholder="e.g. Shelf 13" 
                    type="text" 
                  />
                </div>
              </div>

              <div className="flex flex-col w-full">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Expiry Date</label>
                <div className="relative flex items-center">
                  <input 
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="form-input flex w-full rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 p-4 text-base font-normal" 
                    placeholder="MM/DD/YYYY" 
                    type="date" 
                  />
                </div>
              </div>
            </section>

            <div className="pt-8 pb-10">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#11d462] hover:bg-[#11d462]/90 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#11d462]/20 active:scale-[0.98] disabled:opacity-50"
              >
                <span className="material-symbols-outlined">save</span>
                {isSubmitting ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}