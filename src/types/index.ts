export interface Reagent {
  batchNo: string;
  name: string;
  purity: string;
  expiryDate: string;
  storageCondition: string;
  safetyInstruction: string;
  manufacturer: string;
  createdAt: string;
}

export interface OpeningRecord {
  id: string;
  batchNo: string;
  openedAt: string;
  operator: string;
  status: 'opened' | 'sealed';
  remark?: string;
}

export interface Complaint {
  id: string;
  batchNo: string;
  reportedAt: string;
  reporter: string;
  reason: string;
  status: 'pending' | 'resolved' | 'closed';
  stopUsage: boolean;
}

export interface QualityReport {
  id: string;
  batchNo: string;
  version: string;
  uploadedAt: string;
  uploadedBy: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileData?: string;
  remark?: string;
}

export interface User {
  username: string;
  role: 'experimenter' | 'admin';
  name: string;
}

export type PageType = 'login' | 'query' | 'admin' | 'admin-reagents' | 'admin-reports' | 'admin-complaints' | 'admin-versions' | '404';
