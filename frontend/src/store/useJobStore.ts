import { create } from 'zustand';
import { api } from '../api';

interface JobSummary {
  id: string;
  createdAt: string;
  status: string;
  totalUrls: number;
  stats: { success: number; error: number };
}

interface JobDetails {
  id: string;
  status: string;
  urls: Array<{
    url: string;
    status: string;
    httpStatus?: number;
    error?: string;
    duration?: number;
  }>;
}

interface JobState {
  jobs: JobSummary[];
  activeJob: JobDetails | null;
  pollingIntervalId: number | null;
  loading: boolean;
  
  fetchJobs: () => Promise<void>;
  selectActiveJob: (id: string) => void;
  startPolling: (id: string) => void;
  stopPolling: () => void;
  createJob: (urls: string[]) => Promise<void>;
  cancelActiveJob: () => Promise<void>;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  activeJob: null,
  pollingIntervalId: null,
  loading: false,

  fetchJobs: async () => {
    try {
      const data = await api.getJobs();
      set({ jobs: data });
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  },

  selectActiveJob: async (id: string) => {
    get().stopPolling();
    try {
      const details = await api.getJobDetails(id);
      set({ activeJob: details });
      if (['pending', 'in_progress'].includes(details.status)) {
        get().startPolling(id);
      }
    } catch (err) {
      console.error(err);
    }
  },

  startPolling: (id: string) => {
    const intervalId = window.setInterval(async () => {
      try {
        const details = await api.getJobDetails(id);
        if (get().activeJob?.id === id) {
          set({ activeJob: details });
          get().fetchJobs();
          if (!['pending', 'in_progress'].includes(details.status)) {
            get().stopPolling();
          }
        }
      } catch (err) {
        console.error('Polling error', err);
        get().stopPolling();
      }
    }, 2000);
    set({ pollingIntervalId: intervalId });
  },

  stopPolling: () => {
    const { pollingIntervalId } = get();
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      set({ pollingIntervalId: null });
    }
  },

  createJob: async (urls: string[]) => {
    set({ loading: true });
    try {
      const { jobId } = await api.createJob(urls);
      await get().fetchJobs();
      await get().selectActiveJob(jobId);
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  cancelActiveJob: async () => {
    const { activeJob } = get();
    if (!activeJob) return;
    try {
      await api.cancelJob(activeJob.id);
      await get().selectActiveJob(activeJob.id);
    } catch (err) {
      console.error(err);
    }
  }
}));
