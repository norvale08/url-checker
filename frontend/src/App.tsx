import React from 'react';
import { JobForm } from './components/JobForm';
import { JobList } from './components/JobList';
import { JobDetails } from './components/JobDetails';
import './styles/luxury.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Асинхронный сканер URL</h1>
        <p className="app-subtitle">Проверка доступности веб-ресурсов</p>
      </header>

      <div className="app-grid">
        <div>
          <JobForm />
          <JobList />
        </div>
        <div>
          <JobDetails />
        </div>
      </div>
    </div>
  );
};

export default App;
