'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { DataTable, Column } from '@/components/ui/DataTable';
import { INITIAL_API_KEYS, INITIAL_AUDIT_LOGS } from '@/utils/mockData';
import { ApiKey, AuditLog, UserRole } from '@/types';
import { Users, Key, ShieldCheck, Plus, CheckCircle2, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/stores/authStore';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Invited';
}

export default function TeamAdminPage() {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('members');

  const members: TeamMember[] = [
    { id: user?.id || 'm-1', name: user?.name || user?.email?.split('@')[0] || 'Active User', email: user?.email || 'user@example.com', role: user?.role || 'Senior Counsel', status: 'Active' },
    { id: 'm-2', name: 'Michael Chang', email: 'm.chang@legalos-enterprise.com', role: 'Legal Analyst', status: 'Active' },
    { id: 'm-3', name: 'Elena Rostova', email: 'e.rostova@legalos-enterprise.com', role: 'Auditor', status: 'Active' },
    { id: 'm-4', name: 'David Kim', email: 'd.kim@legalos-enterprise.com', role: 'Admin', status: 'Active' },
  ];

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [auditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const handleGenerateKey = () => {
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: `Custom API Integration Key ${apiKeys.length + 1}`,
      keyPrefix: `leg_live_${Math.random().toString(36).substring(2, 6)}...`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Just now',
      status: 'Active',
    };
    setApiKeys([...apiKeys, newKey]);
    showToast('API Key Created', 'New API token generated for external SNS Workbench ingestion.', 'success');
  };

  const memberColumns: Column<TeamMember>[] = [
    {
      key: 'name',
      header: 'Team Member',
      render: (m) => (
        <div className="flex items-center gap-3">
          <Avatar name={m.name} size="sm" />
          <div>
            <h4 className="text-xs font-bold text-[#18181B] dark:text-slate-100">{m.name}</h4>
            <p className="text-[11px] text-slate-400 font-medium">{m.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role (RBAC)',
      render: (m) => (
        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#EFECE6] dark:bg-[#1C1C1C] text-[#18181B] dark:text-slate-200 border border-[#E2DFD6] dark:border-[#27272A]">
          {m.role}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (m) => (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800/60">
          <CheckCircle2 className="w-3.5 h-3.5" /> {m.status}
        </span>
      ),
    },
  ];

  const apiKeyColumns: Column<ApiKey>[] = [
    {
      key: 'name',
      header: 'Key Identifier',
      render: (k) => (
        <div className="flex items-center gap-2.5">
          <Key className="w-4 h-4 text-[#18181B] dark:text-slate-200" />
          <div>
            <h4 className="text-xs font-bold text-[#18181B] dark:text-slate-100">{k.name}</h4>
            <span className="text-[11px] font-mono text-slate-400">{k.keyPrefix}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created On',
      render: (k) => <span className="text-xs text-slate-500 font-medium">{k.createdAt}</span>,
    },
    {
      key: 'lastUsed',
      header: 'Last Ingestion',
      render: (k) => <span className="text-xs text-slate-500 font-bold">{k.lastUsed}</span>,
    },
    {
      key: 'actions',
      header: 'Copy Token',
      render: () => (
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Copy className="w-3.5 h-3.5" />}
          onClick={() => showToast('Key Copied', 'API Key token copied to clipboard.', 'info')}
        >
          Copy Token
        </Button>
      ),
    },
  ];

  const auditColumns: Column<AuditLog>[] = [
    {
      key: 'userName',
      header: 'User',
      render: (a) => (
        <div>
          <span className="text-xs font-bold text-[#18181B] dark:text-slate-100 block">{a.userName}</span>
          <span className="text-[10px] text-slate-400 font-medium">{a.userEmail}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action Taken',
      render: (a) => <span className="text-xs font-bold text-[#18181B] dark:text-slate-200">{a.action}</span>,
    },
    {
      key: 'target',
      header: 'Target Contract / Resource',
      render: (a) => <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{a.target}</span>,
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (a) => <span className="text-xs text-slate-400 font-medium">{a.timestamp}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif tracking-tight text-[#18181B] dark:text-slate-100">
          Admin Panel & Team Governance
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Manage workspace team roles (RBAC), API ingestion keys, and security audit trails.
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'members', label: 'User Management & Roles', icon: <Users className="w-4 h-4" /> },
          { id: 'apikeys', label: 'API Keys & Webhooks', icon: <Key className="w-4 h-4" /> },
          { id: 'audit', label: 'Security Audit Logs', icon: <ShieldCheck className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {activeTab === 'members' && (
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Organization Members</CardTitle>
              <CardDescription>Role-Based Access Control (RBAC)</CardDescription>
            </div>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => showToast('Invite Sent', 'Workspace invitation dispatched.', 'success')}>
              Invite Counsel
            </Button>
          </div>
          <DataTable columns={memberColumns} data={members} />
        </Card>
      )}

      {activeTab === 'apikeys' && (
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SNS Workbench & Integration API Keys</CardTitle>
              <CardDescription>Authentication tokens for external contract POST ingestion</CardDescription>
            </div>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleGenerateKey}>
              Generate API Key
            </Button>
          </div>
          <DataTable columns={apiKeyColumns} data={apiKeys} />
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card className="space-y-4 p-6">
          <CardHeader className="pb-2">
            <CardTitle>System Audit Logs</CardTitle>
            <CardDescription>Immutable record of user actions and webhook events</CardDescription>
          </CardHeader>
          <DataTable columns={auditColumns} data={auditLogs} />
        </Card>
      )}
    </div>
  );
}
