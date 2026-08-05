'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useToast } from '@/components/ui/Toast';
import { User, Bell, CreditCard, Shield, Sun, Moon, Save } from 'lucide-react';

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
        <h1 className="text-3xl font-bold font-serif tracking-tight text-[#18181B] dark:text-slate-100">
          Account & Workspace Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
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
        <Card className="max-w-2xl space-y-6 p-6">
          <CardHeader className="pb-2">
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
                <p className="text-[11px] text-slate-400 mt-1 font-medium">JPG, PNG, or GIF up to 5MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18181B] dark:text-slate-200">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E2DFD6] dark:border-[#27272A] rounded-xl text-xs font-semibold text-[#18181B] dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18181B] dark:text-slate-200">Corporate Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E2DFD6] dark:border-[#27272A] rounded-xl text-xs font-semibold text-[#18181B] dark:text-slate-100 focus:outline-none"
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
        <Card className="max-w-2xl space-y-4 p-6">
          <CardHeader className="pb-2">
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you receive contract risk alerts & webhook events</CardDescription>
          </CardHeader>
          <div className="divide-y divide-[#E6E4DF] dark:divide-[#27272A]">
            {[
              { title: 'High Risk Alert Trigger', desc: 'Notify immediately when an uploaded contract exceeds 75 Risk Index.' },
              { title: 'SNS Webhook Execution Digest', desc: 'Receive daily summary of contracts processed via SNS Workbench.' },
              { title: 'AI Redline Recommendations', desc: 'Alert when counsel completes redline review on key clauses.' },
            ].map((item, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#18181B] dark:text-slate-100">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#18181B] focus:ring-0 cursor-pointer" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'billing' && (
        <Card className="max-w-2xl space-y-6 p-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EFECE6] dark:bg-[#1C1C1C] border border-[#E2DFD6] dark:border-[#27272A]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Plan</span>
              <h3 className="text-lg font-bold font-serif text-[#18181B] dark:text-slate-100">Enterprise AI Plan</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Unlimited contract analysis, Webhooks, & custom AI models.</p>
            </div>
            <Button size="sm" variant="primary">
              Manage License
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#18181B] dark:text-slate-100">Monthly Webhook Consumption</h4>
            <div className="h-3 w-full bg-[#FAF9F5] dark:bg-[#141414] border border-[#E6E4DF] dark:border-[#27272A] rounded-full overflow-hidden">
              <div className="h-full bg-[#18181B] dark:bg-white w-1/4 rounded-full" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">2,480 of 10,000 monthly Webhook contract analyses used</span>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="max-w-2xl space-y-4 p-6">
          <CardHeader className="pb-2">
            <CardTitle>Security & Password</CardTitle>
            <CardDescription>Configure Two-Factor Authentication (2FA) & Active Sessions</CardDescription>
          </CardHeader>
          <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#141414] border border-[#E6E4DF] dark:border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#18181B] dark:text-slate-200" />
              <div>
                <h4 className="text-xs font-bold text-[#18181B] dark:text-slate-100">Two-Factor Authentication Enabled</h4>
                <p className="text-[11px] text-slate-500 font-medium">Protected via Authenticator App</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Configure
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'theme' && (
        <Card className="max-w-2xl space-y-4 p-6">
          <CardHeader className="pb-2">
            <CardTitle>Appearance & Theme</CardTitle>
            <CardDescription>Switch between Warm Ivory Light Mode and Dark Executive Mode</CardDescription>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => toggleTheme()}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all ${
                theme === 'light'
                  ? 'border-[#18181B] bg-[#FAF9F5] shadow-2xs'
                  : 'border-[#E6E4DF] dark:border-[#27272A]'
              }`}
            >
              <Sun className="w-6 h-6 text-[#18181B]" />
              <div>
                <h4 className="text-xs font-bold text-[#18181B]">Warm Ivory Light</h4>
                <p className="text-[10px] text-slate-500 font-medium">Warm background palette (#FAF9F5)</p>
              </div>
            </button>

            <button
              onClick={() => toggleTheme()}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all ${
                theme === 'dark'
                  ? 'border-white bg-[#0A0A0A] text-white shadow-2xs'
                  : 'border-[#E6E4DF] dark:border-[#27272A]'
              }`}
            >
              <Moon className="w-6 h-6 text-white" />
              <div>
                <h4 className="text-xs font-bold text-white">Executive Charcoal</h4>
                <p className="text-[10px] text-slate-400 font-medium">Deep charcoal dark mode (#0A0A0A)</p>
              </div>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
