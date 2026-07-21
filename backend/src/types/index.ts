export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
export type UrlStatus = 'pending' | 'in_progress' | 'success' | 'error' | 'cancelled';

export interface UrlResult {
  url: string;
  status: UrlStatus;
  httpStatus?: number;
  error?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
}

export interface Job {
  id: string;
  status: JobStatus;
  createdAt: Date;
  urls: UrlResult[];
  processedCount: number;
}
