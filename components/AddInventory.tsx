"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function AddInventory() {
  const router = useRouter();
  const addItem = useMutation(api.inventory.addItem);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
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
        category: category || undefined,
        quantity: Number(quantity),
        location,
        expirationDate: expirationDate || undefined,
      });
      router.push('/inventory');
    } catch (error) {
      console.error("Failed to add item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto">
        <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 sticky top-0 z-10 border-b border-primary/10">
          <Link href="/" aria-label="Go back" className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center hover:bg-primary/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
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
                  placeholder="e.g. Biodegradable Solar Cells" 
                  type="text" 
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Category</label>
                <div className="relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select appearance-none flex w-full rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 p-4 text-base font-normal">
                    <option disabled value="">Select category</option>
                    <option value="eco">Eco-friendly</option>
                    <option value="recycled">Recycled Materials</option>
                    <option value="renewable">Renewable Energy</option>
                    <option value="organic">Organic Compound</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col w-full">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Quantity</label>
                  <input 
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="form-input flex w-full rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 p-4 text-base font-normal" 
                    placeholder="0" 
                    type="number" 
                    min="0"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Location</label>
                  <input 
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-input flex w-full rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 p-4 text-base font-normal" 
                    placeholder="e.g. Shelf A" 
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

            <section className="bg-primary/5 rounded-xl p-5 border border-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-slate-100 font-bold text-base flex items-center gap-2">
                    Sustainability Tracking
                    <span className="material-symbols-outlined text-primary text-lg">eco</span>
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Monitor carbon footprint and eco-impact</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" value="" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </section>

            <div className="pt-8 pb-10">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
              >
                <span className="material-symbols-outlined">save</span>
                {isSubmitting ? 'Saving...' : 'Save Item'}
              </button>
              <p className="text-center text-slate-400 text-xs mt-4">All data is encrypted and synced to the cloud</p>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}