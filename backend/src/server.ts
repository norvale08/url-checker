import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage/memoryStorage';
import { processJob } from './queue/jobQueue';
import { Job, UrlResult } from './types';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/jobs', (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'Urls array is required' });
  }

  const jobId = uuidv4();
  const urlResults: UrlResult[] = urls.map(url => ({
    url,
    status: 'pending'
  }));

  const newJob: Job = {
    id: jobId,
    status: 'pending',
    createdAt: new Date(),
    urls: urlResults,
    processedCount: 0
  };

  storage.saveJob(newJob);
  processJob(jobId);

  res.status(201).json({ jobId });
});

app.get('/api/jobs', (req, res) => {
  const jobs = storage.getAllJobs();
  const summary = jobs.map(job => {
    const successCount = job.urls.filter(u => u.status === 'success').length;
    const errorCount = job.urls.filter(u => u.status === 'error').length;
    
    return {
      id: job.id,
      createdAt: job.createdAt,
      status: job.status,
      totalUrls: job.urls.length,
      stats: { success: successCount, error: errorCount }
    };
  });
  res.json(summary);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = storage.getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

app.delete('/api/jobs/:id', (req, res) => {
  const job = storage.getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  if (job.status === 'pending' || job.status === 'in_progress') {
    job.status = 'cancelled';
    job.urls.forEach(u => {
      if (u.status === 'pending') {
        u.status = 'cancelled';
      }
    });
    storage.saveJob(job);
  }
  res.json({ message: 'Job cancellation requested', job });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));
