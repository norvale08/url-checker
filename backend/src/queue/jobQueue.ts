import axios from 'axios';
import { storage } from '../storage/memoryStorage';
import { UrlResult, Job } from '../types';

const CONCURRENCY_LIMIT = 5;

// Random delay 0-10 seconds as per requirements
const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 10000));

export async function processJob(jobId: string) {
  const job = storage.getJob(jobId);
  if (!job || job.status === 'cancelled') return;

  job.status = 'in_progress';
  storage.saveJob(job);

  const pool = [...job.urls];
  let activeWorkers = 0;
  let index = 0;

  return new Promise<void>((resolve) => {
    async function spawnWorker() {
      const currentJob = storage.getJob(jobId);
      if (!currentJob || currentJob.status === 'cancelled') {
        resolve();
        return;
      }

      if (index >= pool.length) {
        if (activeWorkers === 0) {
          const hasErrors = currentJob.urls.some(u => u.status === 'error');
          currentJob.status = hasErrors && currentJob.urls.every(u => u.status === 'error') ? 'failed' : 'completed';
          storage.saveJob(currentJob);
          resolve();
        }
        return;
      }

      const urlTarget = pool[index++];
      activeWorkers++;

      await processUrl(jobId, urlTarget);

      activeWorkers--;
      spawnWorker();
    }

    const initialWorkers = Math.min(CONCURRENCY_LIMIT, pool.length);
    for (let i = 0; i < initialWorkers; i++) {
      spawnWorker();
    }
  });
}

async function processUrl(jobId: string, urlTarget: UrlResult) {
  const job = storage.getJob(jobId);
  if (!job || job.status === 'cancelled' || urlTarget.status === 'cancelled') return;

  urlTarget.status = 'in_progress';
  urlTarget.startTime = new Date();
  storage.saveJob(job);

  await delay();

  const jobAfterDelay = storage.getJob(jobId);
  if (!jobAfterDelay || jobAfterDelay.status === 'cancelled') {
    urlTarget.status = 'cancelled';
    return;
  }

  try {
    const start = Date.now();
    const response = await axios.head(urlTarget.url, {
      timeout: 5000,
      validateStatus: () => true
    });

    urlTarget.status = 'success';
    urlTarget.httpStatus = response.status;
    urlTarget.duration = Date.now() - start;
  } catch (error: any) {
    urlTarget.status = 'error';
    urlTarget.error = error.message || 'Unknown network error';
  } finally {
    urlTarget.endTime = new Date();
    jobAfterDelay.processedCount++;
    storage.saveJob(jobAfterDelay);
  }
}
