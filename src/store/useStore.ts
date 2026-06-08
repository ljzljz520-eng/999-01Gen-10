import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Reagent, Complaint, OpeningRecord, QualityReport, User } from '../types';
import {
  mockReagents,
  mockComplaints,
  mockOpeningRecords,
  mockQualityReports,
  validateLogin,
} from '../data/mockData';

interface AppState {
  user: User | null;
  reagents: Reagent[];
  openingRecords: OpeningRecord[];
  complaints: Complaint[];
  qualityReports: QualityReport[];
  searchHistory: string[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  searchReagent: (batchNo: string) => Reagent | undefined;
  getOpeningRecords: (batchNo: string) => OpeningRecord[];
  getComplaints: (batchNo: string) => Complaint[];
  hasActiveComplaint: (batchNo: string) => boolean;
  getReports: (batchNo: string) => QualityReport[];
  uploadReport: (batchNo: string, file: File, remark?: string) => QualityReport;
  addComplaint: (complaint: Omit<Complaint, 'id'>) => Complaint;
  addReagent: (reagent: Reagent) => void;
  updateReagent: (batchNo: string, data: Partial<Reagent>) => void;
  deleteReagent: (batchNo: string) => boolean;
  updateComplaintStatus: (id: string, status: Complaint['status'], stopUsage: boolean) => void;
  updateReport: (reportId: string, data: Partial<QualityReport>) => void;
  deleteReport: (reportId: string) => boolean;
}

const generateId = () =>
  Math.random().toString(36).substring(2, 11).toUpperCase();

const generateNextVersion = (existingReports: QualityReport[], isMajor: boolean = false): string => {
  if (existingReports.length === 0) return 'v1.0';
  const lastVersion = existingReports[existingReports.length - 1].version;
  const match = lastVersion.match(/v(\d+)\.(\d+)/);
  if (!match) return 'v1.0';
  const major = parseInt(match[1]);
  const minor = parseInt(match[2]);
  if (isMajor) {
    return `v${major + 1}.0`;
  }
  return `v${major}.${minor + 1}`;
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      reagents: mockReagents,
      openingRecords: mockOpeningRecords,
      complaints: mockComplaints,
      qualityReports: mockQualityReports,
      searchHistory: [],

      login: (username, password) => {
        const user = validateLogin(username, password);
        if (user) {
          set({ user });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null });
      },

      searchReagent: (batchNo) => {
        const { reagents, searchHistory } = get();
        const trimmedBatchNo = batchNo.trim();
        const reagent = reagents.find(r => r.batchNo.toLowerCase() === trimmedBatchNo.toLowerCase());
        if (reagent) {
          const newHistory = [trimmedBatchNo, ...searchHistory.filter(h => h !== trimmedBatchNo)].slice(0, 10);
          set({ searchHistory: newHistory });
        }
        return reagent;
      },

      getOpeningRecords: (batchNo) => {
        return get().openingRecords
          .filter(r => r.batchNo === batchNo)
          .sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());
      },

      getComplaints: (batchNo) => {
        return get().complaints
          .filter(c => c.batchNo === batchNo)
          .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
      },

      hasActiveComplaint: (batchNo) => {
        return get().complaints.some(
          c => c.batchNo === batchNo && c.stopUsage && c.status !== 'closed'
        );
      },

      getReports: (batchNo) => {
        return get().qualityReports
          .filter(r => r.batchNo === batchNo)
          .sort((a, b) => b.version.localeCompare(a.version));
      },

      uploadReport: (batchNo, file, remark) => {
        const { qualityReports, user } = get();
        const existingReports = get().getReports(batchNo);
        const newReport: QualityReport = {
          id: `RPT-${generateId()}`,
          batchNo,
          version: generateNextVersion(existingReports),
          uploadedAt: new Date().toISOString(),
          uploadedBy: user?.name || '未知用户',
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          remark,
        };
        set({ qualityReports: [...qualityReports, newReport] });
        return newReport;
      },

      addComplaint: (complaint) => {
        const { complaints } = get();
        const newComplaint: Complaint = {
          ...complaint,
          id: `CMP-${generateId()}`,
        };
        set({ complaints: [...complaints, newComplaint] });
        return newComplaint;
      },

      addReagent: (reagent) => {
        set(state => ({
          reagents: [...state.reagents, reagent],
        }));
      },

      updateReagent: (batchNo, data) => {
        set(state => ({
          reagents: state.reagents.map(r =>
            r.batchNo === batchNo ? { ...r, ...data } : r
          ),
        }));
      },

      deleteReagent: (batchNo) => {
        set(state => ({
          reagents: state.reagents.filter(r => r.batchNo !== batchNo),
        }));
        return true;
      },

      updateComplaintStatus: (id, status, stopUsage) => {
        set(state => ({
          complaints: state.complaints.map(c =>
            c.id === id ? { ...c, status, stopUsage } : c
          ),
        }));
      },

      updateReport: (reportId, data) => {
        set(state => ({
          qualityReports: state.qualityReports.map(r =>
            r.id === reportId ? { ...r, ...data } : r
          ),
        }));
      },

      deleteReport: (reportId) => {
        set(state => ({
          qualityReports: state.qualityReports.filter(r => r.id !== reportId),
        }));
        return true;
      },
    }),
    {
      name: 'reagent-system-storage',
      partialize: (state) => ({
        reagents: state.reagents,
        complaints: state.complaints,
        qualityReports: state.qualityReports,
        searchHistory: state.searchHistory,
      }),
    }
  )
);
