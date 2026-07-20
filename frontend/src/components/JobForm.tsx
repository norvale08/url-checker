import React, { useState } from 'react';
import { useJobStore } from '../store/useJobStore';

export const JobForm: React.FC = () => {
  const [text, setText] = useState('');
  const { createJob, loading } = useJobStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urls = text.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    if (urls.length === 0) return alert('Введите хотя бы один URL');
    createJob(urls);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Создать новое задание</h3>
      <textarea
        rows={6}
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        placeholder="https://example.com&#10;https://google.com"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }} disabled={loading}>
        {loading ? 'Запуск...' : 'Запустить проверку'}
      </button>
    </form>
  );
};
