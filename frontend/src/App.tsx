import React from 'react';
import { JobForm } from './components/JobForm';
import { JobList } from './components/JobList';
import { JobDetails } from './components/JobDetails';

const App: React.FC = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Асинхронный сканер URL</h1>
      <hr />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
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
