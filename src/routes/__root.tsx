import { createRootRoute, Outlet } from '@tanstack/router';
import App from '../app'; // Import the App component

export const Route = createRootRoute({
  component: () => (
    <App>
      <Outlet />
    </App>
  ),
});
