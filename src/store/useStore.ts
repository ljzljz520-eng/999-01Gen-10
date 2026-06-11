import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Reagent, Complaint, OpeningRecord, QualityReport, User } from '../types';
import { api } from '../api';

interface AppState {
  user: User | null;
  reagents: Reagent[];
  openingRecords: OpeningRecord[];
  complaints: Complaint[];
  qualityReports: QualityReport[];
  searchHistory: string[];
  loading: boolean;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchReagents: () => Promise<void>;
  fetchComplaints: () => Promise<void>;
  searchReagent: (batchNo: string) => Reagent | undefined;
  getOpeningRecords: (batchNo: string) => Promise<OpeningRecord[]>;
  getComplaintsByBatch: (batchNo: string) => Promise<Complaint[]>;
  hasActiveComplaint: (batchNo: string) => boolean;
  getReports: (batchNo: string) => Promise<QualityReport[]>;
  uploadReport: (batchNo: string, file: File, remark: string) => Promise<QualityReport | null>;
  addComplaint: (complaint: Omit<Complaint, 'id'>) => Promise<boolean>;
  addReagent: (reagent: Reagent) => Promise<boolean>;
  updateReagent: (batchNo: string, data: Partial<Reagent>) => Promise<boolean>;
  deleteReagent: (batchNo: string) => Promise<boolean>;
  updateComplaintStatus: (id: string, status: Complaint['status'], stopUsage: boolean) => Promise<boolean>;
  deleteReport: (reportId: string) => Promise<boolean>;
  getNextVersion: (batchNo: string) => Promise<string>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      reagents: [],
      openingRecords: [],
      complaints: [],
      qualityReports: [],
      searchHistory: [],
      loading: false,

      login: async (username, password) => {
        const result = await api.login(username, password);
        if (result.success && result.user) {
          set({ user: result.user });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null });
      },

      fetchReagents: async () => {
        const reagents = await api.getReagents();
        set({ reagents });
      },

      fetchComplaints: async () => {
        const complaints = await api.getComplaints();
        set({ complaints });
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

      getOpeningRecords: async (batchNo) => {
        const records = await api.getOpeningRecords(batchNo);
        return records;
      },

      getComplaintsByBatch: async (batchNo) => {
        const complaints = await api.getComplaints(batchNo);
        return complaints;
      },

      hasActiveComplaint: (batchNo) => {
        return get().complaints.some(
          c => c.batchNo === batchNo && c.stopUsage && c.status !== 'closed'
        );
      },

      getReports: async (batchNo) => {
        const reports = await api.getReports(batchNo);
        return reports;
      },

      uploadReport: async (batchNo, file, remark) => {
        const { user } = get();
        const result = await api.uploadReport(batchNo, file, remark, user?.name || '未知用户');
        if (result.success && result.report) {
          return result.report;
        }
        return null;
      },

      addComplaint: async (complaint) => {
        const result = await api.addComplaint(complaint);
        if (result.success) {
          await get().fetchComplaints();
          return true;
        }
        return false;
      },

      addReagent: async (reagent) => {
        const success = await api.addReagent(reagent);
        if (success) {
          await get().fetchReagents();
          return true;
        }
        return false;
      },

      updateReagent: async (batchNo, data) => {
        const success = await api.updateReagent(batchNo, data);
        if (success) {
          await get().fetchReagents();
          return true;
        }
        return false;
      },

      deleteReagent: async (batchNo) => {
        const success = await api.deleteReagent(batchNo);
        if (success) {
          await get().fetchReagents();
          return true;
        }
        return false;
      },

      updateComplaintStatus: async (id, status, stopUsage) => {
        const success = await api.updateComplaintStatus(id, status, stopUsage);
        if (success) {
          await get().fetchComplaints();
          return true;
        }
        return false;
      },

      deleteReport: async (reportId) => {
        const success = await api.deleteReport(reportId);
        return success;
      },

      getNextVersion: async (batchNo) => {
        return await api.getNextVersion(batchNo);
      },
    }),
    {
      name: 'reagent-system-storage',
      partialize: (state) => ({
        searchHistory: state.searchHistory,
      }),
    }
  )
);
