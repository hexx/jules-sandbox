import { Hono } from 'hono/';
import { serve } from '$std/http/server.ts';
import tasksRouter from './tasks.ts';

const app = new Hono();
export { app as mainApp }; // Export for testing

app.get('/', (c) => {
  return c.json({ message: 'Hello from Hono!' });
});

app.route('/api/tasks', tasksRouter);

serve(app.fetch);
