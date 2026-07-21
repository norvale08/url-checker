import React, { useEffect } from 'react';
import { useJobStore } from '../store/useJobStore';

export const JobList: React.FC = () => {
  const { jobs, fetchJobs, selectActiveJob, activeJob } = useJobStore();

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h3>Список заданий</h3>
      <div className="job-list-container">
        {jobs.length === 0 && (
          <div className="no-jobs-message">
            <p>Заданий пока нет. Создайте первое задание для начала работы.</p>
          </div>
        )}
        {jobs.map(job => (
          <div 
            key={job.id} 
            onClick={() => selectActiveJob(job.id)}
            className={`job-item ${activeJob?.id === job.id ? 'active' : ''}`}
          >
            <div className="job-item-header">
              <span className="job-id">#{job.id.substring(0, 8).toUpperCase()}</span>
              <span className={`job-status ${job.status.replace('_', '-')}`}>
                {job.status === 'in_progress' ? 'В процессе' : 
                 job.status === 'pending' ? 'Ожидание' :
                 job.status === 'completed' ? 'Завершено' : 
                 job.status === 'cancelled' ? 'Отменено' : job.status}
              </span>
            </div>
            <div className="job-item-meta">
              {new Date(job.createdAt).toLocaleString('ru-RU', { 
                dateStyle: 'medium', 
                timeStyle: 'short' 
              })}
            </div>
            <div className="job-item-stats">
              <div className="stat">
                <span className="stat-label">Всего:</span>
                <span className="stat-value">{job.totalUrls}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Успешно:</span>
                <span className="stat-value" style={{ color: 'var(--color-success)' }}>
                  {job.stats.success}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Ошибок:</span>
                <span className="stat-value" style={{ color: 'var(--color-error)' }}>
                  {job.stats.error}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
