import { Document, AnalysisResult, SearchResult, LegalReport, ApiKey, AuditLog, User } from '@/types';

export const INITIAL_USER: User = {
  id: 'usr-101',
  name: 'Sarah Jenkins',
  email: 's.jenkins@legalos-enterprise.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  role: 'Senior Counsel',
  organization: 'Acme Global Legal Ops',
  createdAt: '2025-01-15'
};

// Clear initial data to ensure real PDF upload & backend response processing
export const INITIAL_DOCUMENTS: Document[] = [];

export const INITIAL_ANALYSIS_RESULTS: Record<string, AnalysisResult> = {};

export const INITIAL_SEARCH_RESULTS: SearchResult[] = [];

export const INITIAL_REPORTS: LegalReport[] = [];

export const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: 'key-1',
    name: 'SNS Workbench Webhook Pipeline Key',
    keyPrefix: 'leg_live_8f3a...',
    createdAt: '2026-06-10',
    lastUsed: 'Just now',
    status: 'Active'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
