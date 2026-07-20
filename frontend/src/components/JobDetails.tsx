import React from 'react';
import { useJobStore } from '../store/useJobStore';

export const JobDetails: React.FC = () => {
  const { activeJob, cancelActiveJob } = useJobStore();

  if (!activeJob) {
    return <div style={{ padding: '20px', border: '1px dashed #ccc' }}>Выберите задание из списка для просмотра деталей.</div>;
  }

  const processedCount = activeJob.urls.filter(u => ['success', 'error', 'cancelled'].includes(u.status)).length;
  const isProgressing = ['pending', 'in_progress'].includes(activeJob.status);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Детали задания ({activeJob.status})</h2>
        {isProgressing && (
          <button onClick={cancelActiveJob} style={{ background: '#ff4d4f', color: '#fff', border: 'none', padding: '8px 16px', cursor: 'pointer' }}>
            Отменить задание
          </button>
        )}
      </div>

      <div style={{ margin: '15px 0', background: '#f5f5f5', padding: '10px' }}>
        <strong>Прогресс:</strong> {processedCount} из {activeJob.urls.length} обработано.
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#fafafa', borderBottom: '2px solid #eaeaea' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>URL</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Статус</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>HTTP-Код / Ошибка</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Время (мс)</th>
          </tr>
        </thead>
        <tbody>
          {activeJob.urls.map((u, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '8px', wordBreak: 'break-all' }}>{u.url}</td>
              <td style={{ padding: '8px' }}>
                <span style={{ 
                  color: u.status === 'success' ? 'green' : u.status === 'error' ? 'red' : '#faad14',
                  fontWeight: 'bold'
                }}>
                  {u.status}
                </span>
              </td>
              <td style={{ padding: '8px' }}>
                {u.httpStatus ? `HTTP ${u.httpStatus}` : u.error || '-'}
              </td>
              <td style={{ padding: '8px' }}>{u.duration !== undefined ? `${u.duration} мс` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
