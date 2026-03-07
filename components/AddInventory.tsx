import React from 'react';
import Link from 'next/link';

export default function AddInventory() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto">
        <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 sticky top-0 z-10 border-b border-primary/10">
          <Link href="/" aria-label="Go back" className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center hover:bg-primary/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight flex-1 ml-2">Add Inventory</h2>
          <button className="text-primary flex size-12 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined">info</span>
          </button>
        </header>

        <main className="flex flex-col w-full max-w-md mx-auto p-4 space-y-6">
          <section className="space-y-4">
            <div className="flex flex-col w-full">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Item Name</label>
              <input className="form-input flex w-full rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 p-4 text-base font-normal" placeholder="e.g. Biodegradable Solar Cells" type="text" />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Category</label>
              <div className="relative">
                <select defaultValue="" className="form-select appearance-none flex w-full rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 p-4 text-base font-normal">
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
                <input className="form-input flex w-full rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 p-4 text-base font-normal" placeholder="0" type="number" />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Unit</label>
                <input className="form-input flex w-full rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 p-4 text-base font-normal" placeholder="pcs / kg" type="text" />
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Expiry Date</label>
              <div className="relative flex items-center">
                <input className="form-input flex w-full rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 p-4 text-base font-normal" placeholder="MM/DD/YYYY" type="text" />
                <span className="material-symbols-outlined absolute right-4 text-primary pointer-events-none">calendar_today</span>
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
            <button className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98]">
              <span className="material-symbols-outlined">save</span>
              Save Item
            </button>
            <p className="text-center text-slate-400 text-xs mt-4">All data is encrypted and synced to the cloud</p>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-primary/10 px-6 py-3 flex justify-between items-center md:hidden">
          <Link href="/" className="flex flex-col items-center text-primary">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="text-[10px] mt-1 font-medium">Inventory</span>
          </Link>
          <div className="flex flex-col items-center text-slate-400">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-[10px] mt-1 font-medium">Impact</span>
          </div>
          <div className="flex flex-col items-center text-slate-400">
            <span className="material-symbols-outlined">notifications</span>
            <span className="text-[10px] mt-1 font-medium">Alerts</span>
          </div>
          <div className="flex flex-col items-center text-slate-400">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] mt-1 font-medium">Settings</span>
          </div>
        </nav>
      </div>
    </div>
  );
}