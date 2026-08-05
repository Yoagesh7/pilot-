'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useToast } from '@/components/ui/Toast';
import { User, Bell, CreditCard, Shield, Key, Moon, Sun, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(user?.email || 's.jenkins@legalos-enterprise.com');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Your profile preferences have been updated successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Account & Workspace Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, notification preferences, billing plan, and security settings.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
          { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
          { id: 'billing', label: 'Billing & Plan', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'security', label: 'Security & 2FA', icon: <Shield className="w-4 h-4" /> },
          { id: 'theme', label: 'Theme Preference', icon: <Sun className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {activeTab === 'profile' && (
        <Card className="max-w-2xl space-y-6">
          <CardHeader>
            <CardTitle>Personal Profile</CardTitle>
            <CardDescription>Update your personal information & organization identity</CardDescription>
          </CardHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4 pb-2">
              <Avatar name={name} src={user?.avatar} size="xl" />
              <div>
                <Button type="button" size="sm" variant="outline">
                  Change Photo
                </Button>
                <p className="text-[11px] text-slate-400 mt-1">JPG, PNG, or GIF up to 5MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Corporate Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card className="max-w-2xl space-y-4">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you receive contract risk alerts & webhook events</CardDescription>
          </CardHeader>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { title: 'High Risk Alert Trigger', desc: 'Notify immediately when an uploaded contract exceeds 75 Risk Index.' },
              { title: 'SNS Webhook Execution Digest', desc: 'Receive daily summary of contracts processed via SNS Workbench.' },
              { title: 'AI Redline Recommendations', desc: 'Alert when counsel completes redline review on key clauses.' },
            ].map((item, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'billing' && (
        <Card className="max-w-2xl space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-blue-600">Current Plan</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Enterprise AI Plan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Unlimited contract analysis, Webhooks, & custom AI models.</p>
            </div>
            <Button size="sm" variant="primary">
              Manage License
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Monthly Webhook Consumption</h4>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-1/4 rounded-full" />
            </div>
            <span className="text-[11px] text-slate-400">2,480 of 10,000 monthly Webhook contract analyses used</span>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="max-w-2xl space-y-4">
          <CardHeader>
            <CardTitle>Security & Password</CardTitle>
            <CardDescription>Configure Two-Factor Authentication (2FA) & Active Sessions</CardDescription>
          </CardHeader>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Two-Factor Authentication Enabled</h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">Protected via Authenticator App</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Configure
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'theme' && (
        <Card className="max-w-2xl space-y-4">
          <CardHeader>
            <CardTitle>Appearance & Theme</CardTitle>
            <CardDescription>Switch between Light Mode and Dark Mode</CardDescription>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => toggleTheme()}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all ${
                theme === 'light'
                  ? 'border-blue-600 ring-2 ring-blue-500/20 bg-slate-50'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <Sun className="w-6 h-6 text-amber-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Light Mode</h4>
                <p className="text-[10px] text-slate-500">Clean slate background (#F8FAFC)</p>
              </div>
            </button>

            <button
              onClick={() => toggleTheme()}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all ${
                theme === 'dark'
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-slate-900 text-white'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <Moon className="w-6 h-6 text-blue-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Dark Mode</h4>
                <p className="text-[10px] text-slate-400">Deep midnight contrast (#030712)</p>
              </div>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
