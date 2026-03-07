import React from 'react';

export default function InventoryDashboard() {
  return (
    <>
      <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-[#f6f8f7] dark:bg-[#102218] text-slate-900 dark:text-slate-100 font-sans shadow-2xl antialiased">
        <header className="flex items-center justify-between px-6 pt-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#11d462]/20 flex items-center justify-center overflow-hidden border-2 border-[#11d462]">
              <img alt="User profile" className="w-full h-full object-cover" data-alt="Professional female warehouse manager portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkqOizLfdfqBW9y6iFkl_4GtQADlHLZkTUrYYcNmbk8fz9pkbCV2TnyLbi93KDKXHEu3SYfFGkZlpU0Fl_C7e6BpC7z8NISqP4xCxId2zWA9mN-2ZjozfCHbyZ48htkBq8vjjLxIrAN5WYBc1aHOwEZuT4KFKmD5GrTURMw5qKu94i5boU8OPOx-tbQ1FIxip-gKaeS-7Y7c6dvEnSMKXRUlMvm8q1rjy58GgLkVcnpJ1sBd4N1wyJ7S3NJ_8XNblhX5bKqWLGh0o9"/>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Welcome back,</p>
              <h1 className="text-lg font-bold leading-tight">Alex Green</h1>
            </div>
          </div>
          <button className="relative size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-[#11d462] rounded-full border-2 border-white dark:border-slate-800"></span>
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto px-6 pb-24 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-orange-500 text-sm">inventory_2</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock</span>
              </div>
              <p className="text-2xl font-bold">12 <span className="text-sm font-medium text-slate-400">Items</span></p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-red-500 text-sm">event_busy</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiring</span>
              </div>
              <p className="text-2xl font-bold">4 <span className="text-sm font-medium text-slate-400">Soon</span></p>
            </div>
          </div>

          <section>
            <div className="relative overflow-hidden rounded-xl bg-[#11d462] text-slate-900 p-6 shadow-lg shadow-[#11d462]/20">
              <div className="absolute -right-8 -top-8 size-32 bg-white/20 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Sustainability Impact</h2>
                  <span className="material-symbols-outlined">eco</span>
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight">1.2 Tons</p>
                  <p className="text-sm font-medium opacity-80">CO2 Saved This Month</p>
                </div>
                <div className="w-full bg-slate-900/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-900 h-full w-[75%] rounded-full"></div>
                </div>
                <p className="text-xs font-medium">Reduced waste by 15% vs last period</p>
              </div>
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center mix-blend-overlay" data-alt="Abstract green leaf patterns and textures" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCN0yG_Ee6t4bxXUaxEwuEPWqftzPwVujZ_UtH6llK_is7If9ezbRpB5IeMkDVXuyVR3jD8Wi02UCTVRiqMV_HH5kuAduPix4w5JzQWuXYaB61Cv4gMArVFfXIO3Vp7wPutmKooOx3tMN9d55dc7T_5m06xlPk4O_TEDPWZE4RW54X9rNY1pu7KXHVjTi3z3psTFjJI2sTD3jybxOX_OO9HBMv2Q9hlfY_B_wEE-sDqIWovVZjoOVh-masRNJ0WhT8If_eanKRmfFkT")' }}>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#11d462]">auto_awesome</span>
                AI Insights
              </h2>
              <button className="text-xs font-bold text-[#11d462] hover:underline">View All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="min-w-[180px] snap-center bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-3 shadow-sm">
                <div className="h-32 w-full rounded-lg bg-slate-100 dark:bg-slate-700 mb-3 overflow-hidden">
                  <img alt="Eco Soap" className="w-full h-full object-cover" data-alt="Bottles of clear biodegradable liquid soap" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfSv0o7b7n2-Uo_tyuEnF0X-UntSVtKA7MdYm49Iwu2trpqFB2-n4fAreG4xLY-EHxX1eU1IbkI7AJ3NZK_3e3501BZnRieFwou7T71E86014esBvpDKDMS07M2GMUjEFfIl11gxK029b7MzN34j5a4MEimZcE_cIZ5xG107Q-XsBRdVlY0gXDGI4MelBHrz-XUpL0PQODmBvw14MhCA7sr9ZWqm9epDr_DXNcufV0FKPMNeLbkDGEdLrcBi1AekBwHul1OhA0tYbx"/>
                </div>
                <p className="font-bold text-sm truncate">Biodegradable Soap</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-[#11d462]">schedule</span>
                  <p className="text-xs font-medium text-[#11d462]">4 days left</p>
                </div>
              </div>
              <div className="min-w-[180px] snap-center bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-3 shadow-sm">
                <div className="h-32 w-full rounded-lg bg-slate-100 dark:bg-slate-700 mb-3 overflow-hidden">
                  <img alt="Organic Cleaner" className="w-full h-full object-cover" data-alt="Spray bottle with green natural cleaner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyk7e33GN3lgY3MHuQ9EgPTdK0ztpS09bUD5hNH9hFmLTpI-9W6guPBBqPH7efICbNXbEc4LRLlFNglDi1FS4wmBLiKqXnrjnvIS7B7FAPBHMqkZjYFje6Df9uB8Uyy8mTchd6HpK2T_vqBIxXBK-u_wXxHN4dqI8tTcKGfosfkrXMHMx6slEdq16GQxrpslTcERNlii-6np2Tj53M0QbTfIBGDZeWiWBMLUS0t_CTZff5StqY7uXHbjEOIDv9knqbNuNH4Q7KR8o_"/>
                </div>
                <p className="font-bold text-sm truncate">Organic Cleaner</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-[#11d462]">schedule</span>
                  <p className="text-xs font-medium text-[#11d462]">7 days left</p>
                </div>
              </div>
              <div className="min-w-[180px] snap-center bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-3 shadow-sm">
                <div className="h-32 w-full rounded-lg bg-slate-100 dark:bg-slate-700 mb-3 overflow-hidden">
                  <img alt="Paper Towels" className="w-full h-full object-cover" data-alt="Recycled brown paper towel rolls" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxHY8B0CynJLJ-EnGiwE187aBoQrYcmc3tLpXd9xX0Ef_WVGAbVPmjwW44odxej0rjeaISMI8hsX-ZHSDWx2V9ieTUnhfBuwGCBDFRXkb0Cj4vjcfgc5Xj7BIGbioYCNOo53I6rQySbyEdKMzPMdRRrYAlIWrwvOZ_Hx8JGcgfaAbUphDjlUYPnz_JAtEbfPYZ1mSIHIL4qkgU-LwmT7VqvF1XNzb28W8Njz3uhYgYFZ8n1XEf8U0dTblgH5sNswNL-2Nv-LvMxutD"/>
                </div>
                <p className="font-bold text-sm truncate">Paper Towels</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-red-500">schedule</span>
                  <p className="text-xs font-medium text-red-500">2 days left</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="size-10 rounded-lg bg-[#11d462]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#11d462]">add_shopping_cart</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Bamboo Brushes</p>
                  <p className="text-xs text-slate-500 italic">Auto-restock triggered</p>
                </div>
                <p className="text-xs font-bold">+50 units</p>
              </div>
              <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="size-10 rounded-lg bg-[#11d462]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#11d462]">check_circle</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Recycled Glass</p>
                  <p className="text-xs text-slate-500 italic">Shipment received</p>
                </div>
                <p className="text-xs font-bold">+200 kg</p>
              </div>
            </div>
          </section>
        </main>

        <nav className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 pt-2 pb-6">
          <div className="flex justify-between items-center">
            <a className="flex flex-col items-center gap-1 group" href="#">
              <div className="p-1 rounded-full text-[#11d462]">
                <span className="material-symbols-outlined text-[28px] fill-[1]">home</span>
              </div>
              <span className="text-[10px] font-bold text-[#11d462] uppercase tracking-tighter">Home</span>
            </a>
            <a className="flex flex-col items-center gap-1 group text-slate-400 dark:text-slate-500" href="#">
              <div className="p-1 rounded-full">
                <span className="material-symbols-outlined text-[28px]">inventory</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Inventory</span>
            </a>
            <a className="flex flex-col items-center gap-1 group text-slate-400 dark:text-slate-500" href="#">
              <div className="p-1 rounded-full">
                <span className="material-symbols-outlined text-[28px]">bar_chart_4_bars</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Insights</span>
            </a>
            <a className="flex flex-col items-center gap-1 group text-slate-400 dark:text-slate-500" href="#">
              <div className="p-1 rounded-full">
                <span className="material-symbols-outlined text-[28px]">settings</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}