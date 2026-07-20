import { Job } from '../types';

class MemoryStorage {
  private jobs: Map<string, Job> = new Map();

  saveJob(job: Job): void {
    this.jobs.set(job.id, job);
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  getAllJobs(): Job[] {
    return Array.from(this.jobs.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemoryStorage();
