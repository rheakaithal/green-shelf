"use client";

import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react"
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function SettingsPage() {
  const currentSettings = useQuery(api.settings.getSettings);
  const updateSettings = useMutation(api.settings.updateSettings);

  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [expiringSoonDays, setExpiringSoonDays] = useState(7);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (currentSettings) {
      setLowStockThreshold(currentSettings.lowStockThreshold);
      setExpiringSoonDays(currentSettings.expiringSoonDays);
    }
  }, [currentSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        lowStockThreshold,
        expiringSoonDays,
      });
      setSaveMessage("Settings saved successfully.");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-green-700" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Account Preferences</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account settings and preferences.</p>
          </div>
          
          <hr className="border-slate-200 dark:border-slate-800" />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-medium font-medium text-slate-900 dark:text-white">Dark Mode</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Toggle dark mode appearance.</p>
            </div>
            {/* Placeholder for a toggle component */}
            <div className="w-12 h-6 bg-slate-200 dark:bg-green-600 rounded-full flex items-center p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full transform transition-transform dark:translate-x-6 shadow-sm"></div>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          <div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Inventory Filters</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-medium font-medium text-slate-900 dark:text-white">Low Stock Threshold</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Items with a quantity less than or equal to this will be marked as "Low Stock".</p>
                </div>
                <input
                  type="number"
                  min="0"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-24 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#11d462] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-medium font-medium text-slate-900 dark:text-white">Expiring Soon Threshold (Days)</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Items expiring within this many days will be marked as "Expiring Soon".</p>
                </div>
                <input
                  type="number"
                  min="0"
                  value={expiringSoonDays}
                  onChange={(e) => setExpiringSoonDays(Number(e.target.value))}
                  className="w-24 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#11d462] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#11d462] hover:bg-[#11d462]/90 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-all shadow-sm disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Configuration"}
              </button>
              {saveMessage && (
                <span className="text-sm text-[#11d462] font-medium animate-in fade-in duration-300">
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
