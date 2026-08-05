export type RiskLevel = 'Low' | 'Medium' | 'High';

export type UserRole = 'Admin' | 'Senior Counsel' | 'Legal Analyst' | 'Auditor' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  organization: string;
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: 'pdf' | 'docx' | 'txt';
  status: 'uploaded' | 'scanning' | 'processing' | 'analyzed' | 'failed';
  uploadDate: string;
  riskScore: RiskLevel;
  riskNumerical: number; // 0 - 100
  parties: string[];
  summary: string;
  obligationsCount: number;
  clausesCount: number;
  virusScanPassed?: boolean;
}

export interface PartyInfo {
  name: string;
  role: string;
  jurisdiction?: string;
}

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  type: 'Effective' | 'Expiration' | 'Renewal' | 'Termination Notice' | 'Audit';
  isUrgent?: boolean;
}

export interface Clause {
  id: string;
  title: string;
  section: string;
  content: string;
  type: 'Indemnification' | 'Termination' | 'Liability' | 'IP Rights' | 'Confidentiality' | 'Payment' | 'Governing Law' | 'Custom';
  riskLevel: RiskLevel;
  summary: string;
  recommendation?: string;
}

export interface MissingClause {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  suggestedAddition: string;
}

export interface Obligation {
  id: string;
  party: string;
  description: string;
  dueDate?: string;
  risk: RiskLevel;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  actionItem: string;
}

export interface AnalysisResult {
  id: string;
  documentId: string;
  summary: string;
  risk_score: RiskLevel;
  riskNumerical: number;
  parties: PartyInfo[];
  important_dates: ImportantDate[];
  key_clauses: Clause[];
  missing_clauses: MissingClause[];
  obligations: Obligation[];
  recommendations: Recommendation[];
  webhookProcessedAt?: string;
  rawBackendJson?: any;
  ocrText?: string; // Full contract text sent as document context in AI chat
}

export interface Citation {
  clauseId: string;
  section: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  documentId: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: string;
  isStreaming?: boolean;
}

export interface SearchResult {
  id: string;
  clauseId: string;
  documentId: string;
  documentTitle: string;
  clauseTitle: string;
  section: string;
  snippet: string;
  confidenceScore: number; // 0 - 100
  matchedTerms: string[];
  riskLevel: RiskLevel;
}

export interface LegalReport {
  id: string;
  title: string;
  type: 'Risk Report' | 'Compliance Report' | 'Contract Summary';
  generatedAt: string;
  documentIds: string[];
  documentCount: number;
  status: 'Ready' | 'Generating';
  format: 'pdf' | 'docx' | 'md';
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
}

export interface AuditLog {
  id: string;
  userName: string;
  userEmail: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}
