"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function AddInventory({ onClose }: { onClose: () => void }) {
  const addItem = useMutation(api.inventory.addItem);
  const updateItem = useMutation(api.inventory.updateItem);
  const existingItems = useQuery(api.inventory.getItems, {});

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [unit, setUnit] = useState('');
  const [location, setLocation] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [customLowStockThreshold, setCustomLowStockThreshold] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [duplicateItem, setDuplicateItem] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setDuplicateItem(null);
    
    if (!name || !quantity || !location) return;

    const numQuantity = Number(quantity);
    if (numQuantity <= 0) {
      setErrorText("Quantity must be greater than 0.");
      return;
    }

    if (expirationDate) {
      const expDate = new Date(expirationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      if (expDate < today) {
        setErrorText("Expiration date cannot be in the past.");
        return;
      }
    }

    // Check for duplicates
    if (existingItems) {
      const duplicate = existingItems.find(
        (item: any) => item.name.toLowerCase() === name.trim().toLowerCase() && item.location.toLowerCase() === location.trim().toLowerCase()
      );
      if (duplicate) {
        setErrorText(`An item named "${name}" already exists at "${location}".`);
        setDuplicateItem(duplicate);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await addItem({
        name: name.trim(),
        quantity: numQuantity,
        unit: unit.trim() || undefined,
        location: location.trim(),
        expirationDate: expirationDate || undefined,
        customLowStockThreshold: customLowStockThreshold ? Number(customLowStockThreshold) : undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to add item:", error);
      setErrorText("Failed to add item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateExisting = async () => {
    if (!duplicateItem) return;
    setIsSubmitting(true);
    try {
      await updateItem({
        id: duplicateItem._id,
        quantity: duplicateItem.quantity + Number(quantity),
        expirationDate: expirationDate || duplicateItem.expirationDate,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update item:", error);
      setErrorText("Failed to update item. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar relative">
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
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Quantity & Unit</label>
                  <div className="flex gap-2">
                    <div className="flex items-center h-14 w-2/3 bg-white dark:bg-slate-900/50 border border-primary/20 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
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
                    <input 
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="form-input flex w-1/3 rounded-xl text-slate-900 dark:text-slate-100 border-primary/20 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 p-4 text-base font-normal text-center" 
                      placeholder="unit" 
                      type="text" 
                    />
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

              <div className="flex items-center gap-2 px-1">
                <span className="material-symbols-outlined text-slate-400 text-sm">notifications</span>
                <label className="text-slate-500 dark:text-slate-400 text-xs font-medium">Alert when quantity falls below:</label>
                <input 
                  value={customLowStockThreshold}
                  onChange={(e) => setCustomLowStockThreshold(e.target.value.replace(/\D/g, ''))}
                  className="w-16 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-[#11d462] outline-none text-xs text-center text-slate-700 dark:text-slate-300 transition-colors" 
                  placeholder="Default" 
                  type="text" 
                  inputMode="numeric"
                />
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

            {errorText && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-4 rounded-xl text-red-600 dark:text-red-400 text-sm">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium">{errorText}</p>
                    {duplicateItem && (
                      <button 
                        type="button"
                        onClick={handleUpdateExisting}
                        className="bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg font-medium transition-colors w-full text-center text-xs border border-red-200 dark:border-red-800/50 mt-2"
                      >
                        Add {quantity} exactly to existing inventory
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 pb-10">
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