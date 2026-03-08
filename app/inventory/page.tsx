
"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from 'next/link';
import AddInventory from '@/features/inventory/AddInventory';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); // "ALL", "LOW_STOCK", "EXPIRING_SOON"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [wasteQuantity, setWasteQuantity] = useState("0");
  const [wasteError, setWasteError] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const filter = params.get('filter');
      if (filter && ['ALL', 'LOW_STOCK', 'EXPIRING_SOON'].includes(filter)) {
        setActiveFilter(filter);
      }
    }
  }, []);

  const settings = useQuery(api.settings.getSettings);

  const items = useQuery(api.inventory.getItems, {
    searchTerm,
  });

  const updateItem = useMutation(api.inventory.updateItem);
  const deleteItem = useMutation(api.inventory.deleteItem);
  const logWaste = useMutation(api.inventory.logWaste);

  const handleDelete = async (id: any) => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem({ id });
        setSelectedItem(null);
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  const handleWasteReduction = async (id: any, action: string) => {
    let qtyToReduce = Number(wasteQuantity);

    // If wasteQuantity is left blank or evaluates to 0, use the full quantity.
    // If a number is provided, we cap it at the max available.
    if (!wasteQuantity || qtyToReduce === 0) {
      qtyToReduce = selectedItem.quantity;
    } else {
      qtyToReduce = Math.min(qtyToReduce, selectedItem.quantity);
    }

    if (qtyToReduce > selectedItem.quantity) {
      setWasteError(`Cannot exceed ${selectedItem.quantity} ${selectedItem.unit || 'units'}.`);
      return;
    }

    // If we're somehow reducing by 0 (e.g. stock is already 0), don't log it
    if (qtyToReduce === 0) return;

    // Action could be "fully used", "donated", or "expired"
    await logWaste({ itemId: id, itemName: selectedItem.name, action, quantity: qtyToReduce });
    await updateItem({ id, quantity: Math.max(0, selectedItem.quantity - qtyToReduce) });
    setSelectedItem(null);
    setWasteQuantity("0");
  };

  const isLowStock = (item: any) => {
    if (!settings) return false;
    const threshold = item.customLowStockThreshold !== undefined ? item.customLowStockThreshold : settings.lowStockThreshold;
    return item.quantity <= threshold;
  };

  const isExpiringSoon = (item: any) => {
    if (!settings || !item.expirationDate) return false;
    const expDate = new Date(item.expirationDate);
    // Use start of today to ignore time differences
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= settings.expiringSoonDays;
  };

  const filteredItems = items?.filter(item => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "LOW_STOCK") return isLowStock(item);
    if (activeFilter === "EXPIRING_SOON") return isExpiringSoon(item);
    return true;
  });

  return (
    <>


      <div className="bg-[#f6f8f7] dark:bg-[#102218] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
        <header className="sticky top-0 z-40 bg-[#f6f8f7] dark:bg-[#102218] px-4 pt-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold tracking-tight">Inventory</h1>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full bg-white dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#11d462] text-sm shadow-sm"
                placeholder="Search your inventory..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#11d462] hover:bg-[#11d462]/90 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors shadow-sm shrink-0"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span className="hidden sm:inline">Add Item</span>
            </button>
          </div>
          <div className="flex gap-2 mt-4 pb-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === "ALL" ? "bg-[#11d462] text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#11d462]/50"}`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveFilter("LOW_STOCK")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === "LOW_STOCK" ? "bg-amber-500 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50"}`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setActiveFilter("EXPIRING_SOON")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === "EXPIRING_SOON" ? "bg-red-500 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-500/50"}`}
            >
              Expiring Soon
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 py-2 space-y-4">
          {filteredItems === undefined ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11d462]"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center p-8 text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inventory_2</span>
              <p>No inventory items yet.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 relative group cursor-pointer hover:border-[#11d462]/30 transition-colors"
                onClick={() => setSelectedItem(item)}
              >
                <div className="w-20 h-20 rounded-lg bg-[#11d462]/5 flex items-center justify-center shrink-0 bg-cover bg-center text-[#11d462]">
                  <span className="material-symbols-outlined text-3xl">deployed_code</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base truncate pr-2">{item.name}</h3>
                    <div className="flex flex-col gap-1 items-end shrink-0">
                      {isLowStock(item) && (
                        <span className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-0.5">
                          Low Stock
                        </span>
                      )}
                      {isExpiringSoon(item) && (
                        <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-0.5">
                          Expiring Soon
                        </span>
                      )}
                      {!isLowStock(item) && !isExpiringSoon(item) && item.stockStatus === 'Eco-Friendly' && (
                        <span className="bg-[#11d462]/10 text-[#11d462] text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-0.5">
                          Eco-Friendly
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 flex flex-col gap-0.5 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs">inventory_2</span>
                      <span>Stock: {item.quantity} {item.unit || "units"}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span className="truncate">Loc: {item.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateItem({ id: item._id, quantity: item.quantity + 1 });
                  }}
                  className="bg-[#11d462]/10 hover:bg-[#11d462]/20 text-[#11d462] h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors shadow-sm ml-2"
                  aria-label="Quick Add"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>
              </div>
            ))
          )}
        </main>
      </div>

      {/* Modal Overlay for Add Inventory */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <AddInventory onClose={() => setIsAddModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Modal Overlay for Item Details / Waste Reduction */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
              <header className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 pb-2 sticky top-0 z-10 border-b border-primary/10">
                <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight px-2">Edit Item</h2>
                <button type="button" onClick={() => { setSelectedItem(null); setWasteQuantity("0"); setWasteError(""); }} aria-label="Close" className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center hover:bg-primary/10 rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </header>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Item Details</h3>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Name</label>
                      <input
                        type="text"
                        value={selectedItem.name}
                        onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#11d462] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Quantity</label>
                        <input
                          type="number"
                          min="0"
                          value={selectedItem.quantity}
                          onChange={(e) => setSelectedItem({ ...selectedItem, quantity: Number(e.target.value) })}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#11d462] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</label>
                        <input
                          type="text"
                          value={selectedItem.unit || ''}
                          onChange={(e) => setSelectedItem({ ...selectedItem, unit: e.target.value })}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#11d462] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white font-medium"
                          placeholder="e.g. lbs"
                        />
                      </div>
                    </div>
                    {selectedItem.location && (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
                        <input
                          type="text"
                          value={selectedItem.location || ''}
                          onChange={(e) => setSelectedItem({ ...selectedItem, location: e.target.value })}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#11d462] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white font-medium"
                          placeholder="e.g. Shelf A"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 pb-1">
                      <span className="material-symbols-outlined text-slate-400 text-sm">notifications</span>
                      <label className="text-slate-500 dark:text-slate-400 text-xs font-medium">Alert when quantity falls below:</label>
                      <input
                        value={selectedItem.customLowStockThreshold !== undefined ? selectedItem.customLowStockThreshold : ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setSelectedItem({ ...selectedItem, customLowStockThreshold: val ? Number(val) : undefined });
                        }}
                        className="w-16 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-[#11d462] outline-none text-xs text-center text-slate-700 dark:text-slate-300 transition-colors"
                        placeholder={settings?.lowStockThreshold?.toString() || "Default"}
                        type="text"
                        inputMode="numeric"
                      />
                    </div>

                    {selectedItem.expirationDate && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Expires</span>
                        <span className="font-medium text-slate-900 dark:text-white">{selectedItem.expirationDate}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      updateItem({
                        id: selectedItem._id,
                        name: selectedItem.name,
                        quantity: selectedItem.quantity,
                        unit: selectedItem.unit || undefined,
                        location: selectedItem.location,
                        customLowStockThreshold: selectedItem.customLowStockThreshold
                      });
                      setSelectedItem(null);
                      setWasteQuantity("0");
                      setWasteError("");
                    }}
                    className="w-full mt-4 bg-[#11d462] hover:bg-[#11d462]/90 text-white font-bold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">save</span>
                    Save Changes
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">recycling</span>
                    Waste Reduction Log
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 text-center">How was this asset utilized?</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleWasteReduction(selectedItem._id, "fully used")}
                      disabled={!!wasteError}
                      className={`w-full flex flex-col items-center justify-center gap-1 p-3 rounded-xl border font-medium transition-colors text-xs sm:text-sm ${!!wasteError
                          ? "opacity-50 cursor-not-allowed border-green-200 bg-green-50 text-green-400"
                          : "border-[#11d462]/30 bg-[#11d462]/10 hover:bg-[#11d462]/20 text-green-700 dark:text-[#11d462]"
                        }`}
                    >
                      <span className="material-symbols-outlined mb-1">check_circle</span>
                      <span>Fully Used</span>
                    </button>
                    <button
                      onClick={() => handleWasteReduction(selectedItem._id, "donated")}
                      disabled={!!wasteError}
                      className={`w-full flex flex-col items-center justify-center gap-1 p-3 rounded-xl border font-medium transition-colors text-xs sm:text-sm ${!!wasteError
                          ? "opacity-50 cursor-not-allowed border-green-200 bg-green-50 text-green-400"
                          : "border-[#11d462]/30 bg-[#11d462]/10 hover:bg-[#11d462]/20 text-green-700 dark:text-[#11d462]"
                        }`}
                    >
                      <span className="material-symbols-outlined mb-1">volunteer_activism</span>
                      <span>Donated</span>
                    </button>
                    <button
                      onClick={() => handleWasteReduction(selectedItem._id, "expired")}
                      disabled={!!wasteError}
                      className={`w-full flex flex-col items-center justify-center gap-1 p-3 rounded-xl border font-medium transition-colors text-xs sm:text-sm ${!!wasteError
                          ? "opacity-50 cursor-not-allowed border-red-200 bg-red-50 text-red-400"
                          : "border-red-200 dark:border-red-900/50 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400"
                        }`}
                    >
                      <span className="material-symbols-outlined mb-1">delete_sweep</span>
                      <span>Expired</span>
                    </button>
                  </div>
                  {wasteError && (
                    <div className="mt-2 text-center text-xs text-red-500 font-medium">
                      {wasteError}
                    </div>
                  )}
                  <div className="mt-4 flex flex-col gap-2 items-center">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Quantity:</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={wasteQuantity}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (Number(val) > selectedItem.quantity) {
                            setWasteError(`Cannot exceed ${selectedItem.quantity} ${selectedItem.unit || 'units'}.`);
                          } else {
                            setWasteError("");
                          }
                          setWasteQuantity(val);
                        }}
                        className="w-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#11d462] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white font-medium text-center"
                        placeholder={selectedItem.quantity.toString()}
                      />
                      <span className="ml-2 text-sm text-slate-500">{selectedItem.unit || 'units'}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center max-w-[250px]">
                      Leave Blank to Empty Entire Stock.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => handleDelete(selectedItem._id)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                    Remove Item From Inventory
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}