const API_BASE = 'http://localhost:3001/api';

import { Reagent, Complaint, OpeningRecord, QualityReport, User } from '../types';

function mapReagent(r: any): Reagent {
  return {
    batchNo: r.batch_no,
    name: r.name,
    purity: r.purity,
    expiryDate: r.expiry_date,
    storageCondition: r.storage_condition,
    safetyInstruction: r.safety_instruction,
    manufacturer: r.manufacturer,
    createdAt: r.created_at,
  };
}

function mapOpeningRecord(r: any): OpeningRecord {
  return {
    id: r.id,
    batchNo: r.batch_no,
    openedAt: r.opened_at,
    operator: r.operator,
    status: r.status,
    remark: r.remark,
  };
}

export const api = {
  async login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  async getReagents(): Promise<Reagent[]> {
    const res = await fetch(`${API_BASE}/reagents`);
    const data = await res.json();
    return data.map(mapReagent);
  },

  async addReagent(reagent: Reagent): Promise<boolean> {
    const res = await fetch(`${API_BASE}/reagents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reagent),
    });
    const data = await res.json();
    return data.success;
  },

  async updateReagent(batchNo: string, data: Partial<Reagent>): Promise<boolean> {
    const res = await fetch(`${API_BASE}/reagents/${encodeURIComponent(batchNo)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return result.success;
  },

  async deleteReagent(batchNo: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/reagents/${encodeURIComponent(batchNo)}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  async getOpeningRecords(batchNo: string): Promise<OpeningRecord[]> {
    const res = await fetch(`${API_BASE}/opening-records/${encodeURIComponent(batchNo)}`);
    const data = await res.json();
    return data.map(mapOpeningRecord);
  },

  async getComplaints(batchNo?: string): Promise<Complaint[]> {
    const url = batchNo ? `${API_BASE}/complaints/${encodeURIComponent(batchNo)}` : `${API_BASE}/complaints`;
    const res = await fetch(url);
    const data = await res.json();
    return data.map((c: any) => ({
      id: c.id,
      batchNo: c.batch_no,
      reportedAt: c.reported_at,
      reporter: c.reporter,
      reason: c.reason,
      status: c.status,
      stopUsage: !!c.stop_usage || !!c.stopUsage,
    }));
  },

  async addComplaint(complaint: Omit<Complaint, 'id'>): Promise<{ success: boolean; id?: string }> {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaint),
    });
    return res.json();
  },

  async updateComplaintStatus(id: string, status: Complaint['status'], stopUsage: boolean): Promise<boolean> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, stopUsage }),
    });
    const data = await res.json();
    return data.success;
  },

  async getReports(batchNo: string): Promise<QualityReport[]> {
    const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(batchNo)}`);
    return res.json();
  },

  async uploadReport(batchNo: string, file: File, remark: string, uploadedBy: string): Promise<{ success: boolean; report?: QualityReport; error?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('batchNo', batchNo);
    formData.append('remark', remark);
    formData.append('uploadedBy', uploadedBy);
    const res = await fetch(`${API_BASE}/reports/upload`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  async deleteReport(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  getDownloadUrl(id: string): string {
    return `${API_BASE}/reports/${encodeURIComponent(id)}/download`;
  },

  async getNextVersion(batchNo: string): Promise<string> {
    const res = await fetch(`${API_BASE}/next-version/${encodeURIComponent(batchNo)}`);
    const data = await res.json();
    return data.nextVersion;
  },
};
