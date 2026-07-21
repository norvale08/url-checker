import React from 'react';
import { useJobStore } from '../store/useJobStore';

export const JobDetails: React.FC = () => {
  const { activeJob, cancelActiveJob } = useJobStore();

  if (!activeJob) {
    return (
      <div className="card empty-state">
        <div className="empty-state-icon">◈</div>
        <h3 style={{ textTransform: 'none', letterSpacing: '0.5px', fontSize: '1rem' }}>
          Задание не выбрано
        </h3>
        <p>Выберите задание из списка для просмотра деталей</p>
      </div>
    );
  }

  const processedCount = activeJob.urls.filter(u =>
    ['success', 'error', 'cancelled'].includes(u.status)
  ).length;
  const progressPct = activeJob.urls.length > 0
    ? Math.round((processedCount / activeJob.urls.length) * 100)
    : 0;
  const isProgressing = ['pending', 'in_progress'].includes(activeJob.status);

  const statusLabel: Record<string, string> = {
    pending: 'Ожидание',
    in_progress: 'В процессе',
    completed: 'Завершено',
    cancelled: 'Отменено',
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="job-details-header">
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Детали задания</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="job-id" style={{ fontSize: '0.9rem' }}>
              #{activeJob.id.substring(0, 8).toUpperCase()}
            </span>
            <span className={`job-status ${activeJob.status.replace('_', '-')}`}>
              {statusLabel[activeJob.status] ?? activeJob.status}
            </span>
          </div>
        </div>
        {isProgressing && (
          <button className="btn btn-danger" onClick={cancelActiveJob}>
            Отменить
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-label">
          <span>Прогресс проверки</span>
          <span className="progress-pct">{progressPct}%</span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-bar-fill${isProgressing ? ' progress-bar-fill--animated' : ''}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="progress-stats">
          <span>
            <span className="stat-label">Обработано: </span>
            <span className="stat-value">{processedCount}</span>
          </span>
          <span>
            <span className="stat-label">Всего: </span>
            <span className="stat-value">{activeJob.urls.length}</span>
          </span>
          <span>
            <span className="stat-label">Успешно: </span>
            <span className="stat-value" style={{ color: 'var(--color-success)' }}>
              {activeJob.stats.success}
            </span>
          </span>
          <span>
            <span className="stat-label">Ошибок: </span>
            <span className="stat-value" style={{ color: 'var(--color-error)' }}>
              {activeJob.stats.error}
            </span>
          </span>
        </div>
      </div>

      {/* URL Results Table */}
      <div className="table-container">
        <table className="luxury-table">
          <thead>
            <tr>
              <th>URL</th>
              <th>Статус</th>
              <th>HTTP / Ошибка</th>
              <th>Время</th>
            </tr>
          </thead>
          <tbody>
            {activeJob.urls.map((u, i) => (
              <tr key={i} className="url-result-row">
                <td className="url-cell">{u.url}</td>
                <td>
                  <span className={`status-badge ${u.status === 'success' ? 'success' : u.status === 'error' ? 'error' : u.status === 'cancelled' ? 'cancelled' : 'pending'}`}>
                    {u.status === 'success' ? 'Успех'
                      : u.status === 'error' ? 'Ошибка'
                      : u.status === 'cancelled' ? 'Отменено'
                      : 'Ожидание'}
                  </span>
                </td>
                <td className="http-cell">
                  {u.httpStatus
                    ? <span className={`http-code http-code--${u.httpStatus < 400 ? 'ok' : 'err'}`}>HTTP {u.httpStatus}</span>
                    : u.error
                    ? <span className="error-text">{u.error}</span>
                    : <span className="muted-text">—</span>}
                </td>
                <td className="duration-cell">
                  {u.duration !== undefined
                    ? <span className="duration-value">{u.duration}<span className="duration-unit"> мс</span></span>
                    : <span className="muted-text">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
