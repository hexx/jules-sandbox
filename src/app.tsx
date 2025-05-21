import React from 'react';
import { Outlet } from '@tanstack/router';
import { Button } from '@/components/ui/button.tsx'; // Using .tsx extension for explicit import

const App: React.FC = () => {
  return (
    <div className="p-4"> {/* Added some Tailwind padding */}
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-primary">Task Management App</h1>
        <Button variant="outline" size="sm" className="mt-2">
          Test shadcn/ui Button
        </Button>
      </header>
      <hr className="my-4 border-border" /> {/* Styled hr */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
