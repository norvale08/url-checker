import React from 'react';
import { useJobStore } from '../store/useJobStore';

export const JobDetails: React.FC = () => {
  const { activeJob, cancelActiveJob } = useJobStore();

  if (!activeJob) {
    return (
      <div className="card empty-state">
        <h3>Задание не выбрано</h3>
        <p>Выберите задание из списка для просмотра деталей</p>
      </div>
    );
  }

  const urls = activeJob.urls || [];
  const processedCount = urls.filter(u =>
    ['success', 'error', 'cancelled'].includes(u.status)
  ).length;
  const successCount = urls.filter(u => u.status === 'success').length;
  const errorCount = urls.filter(u => u.status === 'error').length;
  const progressPct = urls.length > 0
    ? Math.round((processedCount / urls.length) * 100)
    : 0;
  const isProgressing = ['pending', 'in_progress'].includes(activeJob.status);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидание';
      case 'in_progress': return 'В процессе';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  const getUrlStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Успех';
      case 'error': return 'Ошибка';
      case 'cancelled': return 'Отменено';
      default: return 'Ожидание';
    }
  };

  return (
    <div className="card">
      <div className="job-details-header">
        <div>
          <h2>Детали задания</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="job-id">#{activeJob.id.substring(0, 8).toUpperCase()}</span>
            <span className={`job-status ${activeJob.status.replace('_', '-')}`}>
              {getStatusLabel(activeJob.status)}
            </span>
          </div>
        </div>
        {isProgressing && (
          <button className="btn btn-danger" onClick={cancelActiveJob}>
            Отменить
          </button>
        )}
      </div>

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
            <span className="stat-value">{urls.length}</span>
          </span>
          <span>
            <span className="stat-label">Успешно: </span>
            <span className="stat-value" style={{ color: 'var(--color-success)' }}>
              {successCount}
            </span>
          </span>
          <span>
            <span className="stat-label">Ошибок: </span>
            <span className="stat-value" style={{ color: 'var(--color-error)' }}>
              {errorCount}
            </span>
          </span>
        </div>
      </div>

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
            {urls.map((u, i) => (
              <tr key={i} className="url-result-row">
                <td className="url-cell">{u.url}</td>
                <td>
                  <span className={`status-badge ${u.status === 'success' ? 'success' : u.status === 'error' ? 'error' : u.status === 'cancelled' ? 'cancelled' : 'pending'}`}>
                    {getUrlStatusLabel(u.status)}
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
