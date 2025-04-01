"use client"

import { useState } from "react"
import { User, Bell, Shield, CreditCard, HelpCircle, LogOut } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "help", label: "Help & Support", icon: HelpCircle },
  ]

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}

              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      defaultValue="User"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      defaultValue="user@example.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="currency"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Preferred Currency
                    </label>
                    <select
                      id="currency"
                      defaultValue="INR"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Transaction Alerts</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get notified about new transactions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Budget Alerts</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Get notified when you're close to budget limits
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Goal Progress</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Get notified about your financial goal progress
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="pt-4">
                    <button className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "subscription" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subscription</h2>
                <div className="p-4 bg-gray-50 dark:bg-zinc-700/50 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Current Plan</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      Free Plan
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You are currently on the free plan with limited features.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Premium Plan</h3>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">$9.99/month</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Unlock all features and get detailed financial insights.
                    </p>
                    <button className="w-full px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                      Upgrade to Premium
                    </button>
                  </div>

                  <div className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Business Plan</h3>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">$19.99/month</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Perfect for small businesses with multiple accounts and users.
                    </p>
                    <button className="w-full px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                      Upgrade to Business
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "help" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Help & Support</h2>

                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          How do I add a new account?
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Go to the Accounts page and click on the "Add Account" button to create a new account.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          How do I track my expenses?
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Add your transactions in the Transactions page and they will automatically be categorized and
                          tracked.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          How do I set financial goals?
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Visit the Goals page and click on "Add Goal" to create a new financial goal with a target
                          amount and date.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Contact Support</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Need help with something not covered in the FAQs? Our support team is here to help.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="support-email"
                          className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="support-email"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Your email address"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="support-message"
                          className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Message
                        </label>
                        <textarea
                          id="support-message"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe your issue or question"
                        ></textarea>
                      </div>
                      <button className="w-full px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

