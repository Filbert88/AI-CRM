"use client"

import { Camera, LogOut } from "lucide-react"

export function AccountTab() {
  return (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="glass-panel p-8">
        <h3 className="text-lg font-semibold text-foreground mb-6">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">JD</span>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-foreground rounded-lg transition-colors font-medium">
            <Camera size={18} />
            Change Photo
          </button>
        </div>
      </div>

      {/* Account Fields */}
      <div className="glass-panel p-8">
        <h3 className="text-lg font-semibold text-foreground mb-6">Account Information</h3>
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <input type="text" defaultValue="John Doe" className="glass-input w-full px-4 py-3 text-sm" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input type="email" defaultValue="john.doe@example.com" className="glass-input w-full px-4 py-3 text-sm" />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Role</label>
            <select className="glass-input w-full px-4 py-3 text-sm">
              <option>Sales Representative</option>
              <option>Sales Manager</option>
              <option>Executive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg transition-all font-medium">
          Save Changes
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors font-medium">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
