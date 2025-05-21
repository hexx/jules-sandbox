import React from 'react';
import { Outlet } from '@tanstack/router';

const App: React.FC = () => {
  return (
    <div>
      <h1>Task Management App</h1>
      <hr />
      <Outlet />
    </div>
  );
};

export default App;
