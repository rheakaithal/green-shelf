"use client";

export default function NotificationCenter() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
        {/* Header Navigation */}
        <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-primary/10">
          <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
              </button>
              <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
            </div>
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">settings</span>
            </button>
          </div>
          {/* Categories Tabs */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex border-b border-primary/10 px-4 gap-6">
              <a className="flex flex-col items-center justify-center border-b-2 border-primary text-primary pb-3 pt-2" href="#">
                <p className="text-sm font-bold">Stock Alerts</p>
              </a>
              <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 hover:text-primary pb-3 pt-2" href="#">
                <p className="text-sm font-bold">Expirations</p>
              </a>
              <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 hover:text-primary pb-3 pt-2" href="#">
                <p className="text-sm font-bold">Eco-Insights</p>
              </a>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Today</h2>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors px-3 py-1 rounded-lg hover:bg-primary/5">
              <span className="material-symbols-outlined text-base">delete_sweep</span>
                Clear All
            </button>
          </div>

          {/* Notification List */}
          <div className="space-y-4">
            {/* Notification Item: Stock Alert */}
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-primary/10 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0 size-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-base">Low Stock: Biodegradable Casings</h3>
                    <span className="text-xs text-slate-400">2h ago</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Current inventory is below 15%. Average daily consumption has increased by 12% this week.</p>
                  <div className="flex gap-2">
                    <button className="bg-primary text-white text-sm font-bold py-2 px-4 rounded-lg hover:brightness-110 transition-all">
                      Reorder Now
                    </button>
                    <button className="bg-primary/10 text-primary text-sm font-bold py-2 px-4 rounded-lg hover:bg-primary/20 transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Item: Eco Insight */}
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-primary/10 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0 size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">eco</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-base">Sustainability Milestone Reached</h3>
                    <span className="text-xs text-slate-400">5h ago</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Your warehouse optimized local sourcing, reducing carbon emissions by 450kg CO2 this month!</p>
                  <button className="bg-primary/10 text-primary text-sm font-bold py-2 px-4 rounded-lg hover:bg-primary/20 transition-all">
                    Review Impact
                  </button>
                </div>
              </div>
            </div>

            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 pt-4">Yesterday</h2>
            
            {/* Notification Item: Expiration */}
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-primary/10 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0 size-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-base">Batch #A-204 Expiring Soon</h3>
                    <span className="text-xs text-slate-400">1d ago</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">320 units of Organic Solar Film will expire in 48 hours. Consider relocating for priority use.</p>
                  <div className="flex gap-2">
                    <button className="bg-primary text-white text-sm font-bold py-2 px-4 rounded-lg hover:brightness-110 transition-all">
                      Allocate Stock
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Item: System Info */}
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-primary/10 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0 size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-base">New Supplier Verified</h3>
                    <span className="text-xs text-slate-400">1d ago</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">'EcoPolymers Inc' has been added to your approved green vendors list after successful ESG auditing.</p>
                  <button className="bg-primary/10 text-primary text-sm font-bold py-2 px-4 rounded-lg hover:bg-primary/20 transition-all">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="sticky bottom-0 bg-background-light dark:bg-background-dark border-t border-primary/10 pb-6 pt-2 px-4">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <a className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">home</span>
              <span className="text-[10px] font-medium">Home</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="text-[10px] font-medium">Inventory</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">bar_chart</span>
              <span className="text-[10px] font-medium">Analytics</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-primary" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
              <span className="text-[10px] font-bold">Notifications</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">person</span>
              <span className="text-[10px] font-medium">Profile</span>
            </a>
          </div>
        </nav>
    </div>
  );
}