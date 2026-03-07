import { Settings } from "lucide-react"

export default function SettingsPage() {
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
        </div>
      </div>
    </div>
  )
}
