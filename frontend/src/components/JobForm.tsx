import React, { useState } from 'react';
import { useJobStore } from '../store/useJobStore';

export const JobForm: React.FC = () => {
  const [text, setText] = useState('');
  const { createJob, loading, error, clearError } = useJobStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const urls = text.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    if (urls.length === 0) return alert('Введите хотя бы один URL');
    try {
      await createJob(urls);
      setText('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card job-form">
      <h3>Создать новое задание</h3>
      {error && (
        <div className="error-message" style={{ color: 'var(--color-error)', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="urls-input">
            Список URL-адресов
          </label>
          <textarea
            id="urls-input"
            rows={6}
            className="form-textarea"
            placeholder="https://example.com&#10;https://google.com&#10;https://github.com"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && <span className="loading-spinner"></span>}
          {loading ? 'Запуск проверки...' : 'Запустить проверку'}
        </button>
      </form>
    </div>
  );
};
