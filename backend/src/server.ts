import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage/memoryStorage';
import { processJob } from './queue/jobQueue';
import { Job, UrlResult } from './types';

const app = express();

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create new job
app.post('/api/jobs', (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'Urls array is required' });
  }

  // Validate URL count limit
  const MAX_URLS = 100;
  if (urls.length > MAX_URLS) {
    return res.status(400).json({ error: `Maximum ${MAX_URLS} URLs allowed per job` });
  }

  // Validate URL format and deduplicate
  const urlRegex = /^https?:\/\/.+/;
  const uniqueUrls = new Set<string>();
  const invalidUrls: string[] = [];

  for (const url of urls) {
    if (typeof url !== 'string' || !urlRegex.test(url.trim())) {
      invalidUrls.push(url);
    } else {
      uniqueUrls.add(url.trim());
    }
  }

  if (invalidUrls.length > 0) {
    return res.status(400).json({ 
      error: 'Invalid URL format. URLs must start with http:// or https://',
      invalidUrls 
    });
  }

  if (uniqueUrls.size === 0) {
    return res.status(400).json({ error: 'No valid URLs provided' });
  }

  const jobId = uuidv4();
  const urlResults: UrlResult[] = Array.from(uniqueUrls).map(url => ({
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

// Get all jobs (summary)
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

// Get job details
app.get('/api/jobs/:id', (req, res) => {
  const job = storage.getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// Cancel job
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
