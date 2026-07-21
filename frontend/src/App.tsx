import React from 'react';
import { JobForm } from './components/JobForm';
import { JobList } from './components/JobList';
import { JobDetails } from './components/JobDetails';
import './styles/luxury.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        {/* Decorative ornament above title */}
        <div className="header-ornament">
          <span className="header-ornament-line" />
          <span className="header-ornament-diamond">◆</span>
          <span className="header-ornament-line header-ornament-line--right" />
        </div>

        <h1>Асинхронный сканер URL</h1>

        <p className="app-subtitle">Элегантная платформа для мониторинга веб-ресурсов</p>

        {/* Tagline badges */}
        <div className="header-tagline">
          <span>Мониторинг</span>
          <span className="header-tagline-dot" />
          <span>Аналитика</span>
          <span className="header-tagline-dot" />
          <span>Надёжность</span>
        </div>
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
