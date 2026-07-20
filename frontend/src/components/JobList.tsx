import React, { useEffect } from 'react';
import { useJobStore } from '../store/useJobStore';

export const JobList: React.FC = () => {
  const { jobs, fetchJobs, selectActiveJob, activeJob } = useJobStore();

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h3>Список заданий</h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
        {jobs.length === 0 && <p>Заданий пока нет</p>}
        {jobs.map(job => (
          <div 
            key={job.id} 
            onClick={() => selectActiveJob(job.id)}
            style={{ 
              padding: '10px', 
              borderBottom: '1px solid #eee', 
              cursor: 'pointer',
              background: activeJob?.id === job.id ? '#e6f7ff' : 'transparent'
            }}
          >
            <strong>ID:</strong> {job.id.substring(0, 8)}... | 
            <strong> Статус:</strong> {job.status} <br />
            <small>{new Date(job.createdAt).toLocaleString()}</small> <br />
            <small>Всего: {job.totalUrls} (Успешно: {job.stats.success} / Ошибок: {job.stats.error})</small>
          </div>
        ))}
      </div>
    </div>
  );
};
