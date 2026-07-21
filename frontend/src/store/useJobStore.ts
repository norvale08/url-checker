import { create } from 'zustand';
import { api } from '../api';

type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
type UrlStatus = 'pending' | 'in_progress' | 'success' | 'error' | 'cancelled';

interface JobSummary {
  id: string;
  createdAt: string;
  status: JobStatus;
  totalUrls: number;
  stats: { success: number; error: number };
}

interface JobDetails {
  id: string;
  status: JobStatus;
  createdAt: string;
  urls: Array<{
    url: string;
    status: UrlStatus;
    httpStatus?: number;
    error?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
  }>;
  processedCount: number;
}

interface JobState {
  jobs: JobSummary[];
  activeJob: JobDetails | null;
  pollingIntervalId: number | null;
  loading: boolean;
  error: string | null;

  fetchJobs: () => Promise<void>;
  selectActiveJob: (id: string) => void;
  startPolling: (id: string) => void;
  stopPolling: () => void;
  createJob: (urls: string[]) => Promise<void>;
  cancelActiveJob: () => Promise<void>;
  clearError: () => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  activeJob: null,
  pollingIntervalId: null,
  loading: false,
  error: null,

  fetchJobs: async () => {
    try {
      const data = await api.getJobs();
      set({ jobs: data, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch jobs';
      set({ error: errorMessage });
      console.error(err);
    }
  },

  selectActiveJob: async (id: string) => {
    get().stopPolling();
    try {
      const details = await api.getJobDetails(id);
      set({ activeJob: details, error: null });
      if (['pending', 'in_progress'].includes(details.status)) {
        get().startPolling(id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch job details';
      set({ error: errorMessage });
      console.error(err);
    }
  },

  startPolling: (id: string) => {
    const intervalId = window.setInterval(async () => {
      try {
        const details = await api.getJobDetails(id);
        if (get().activeJob?.id === id) {
          set({ activeJob: details, error: null });
          get().fetchJobs();
          if (!['pending', 'in_progress'].includes(details.status)) {
            get().stopPolling();
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to poll job details';
        set({ error: errorMessage });
        console.error(err);
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
    set({ loading: true, error: null });
    try {
      const { jobId } = await api.createJob(urls);
      await get().fetchJobs();
      await get().selectActiveJob(jobId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create job';
      set({ error: errorMessage });
      console.error(err);
      throw err;
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel job';
      set({ error: errorMessage });
      console.error(err);
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));
