import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/router';
// App is rendered via the root route, so direct import here might be redundant
// import App from './app.tsx';
import './index.css'; // Import CSS

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree, basepath: '/' });

// Register the router instance for type safety
declare module '@tanstack/router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {/* <App /> is not needed here as RouterProvider will render the root route */}
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
