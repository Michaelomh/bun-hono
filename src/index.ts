import { createApp } from '@/app';
import { customLogger } from '@/middleware/logger';
import index from '@/routes/index.routes';
import tasks from '@/routes/tasks/tasks.index';

import configureOpenApi from './lib/configure-open-api';

const app = createApp();
const routes = [
  index,
  tasks,
];

configureOpenApi(app);

routes.forEach((route) => {
  app.route('/', route);
});

app.get('/', (c) => {
  customLogger('Testing Logger');
  return c.text('Hello Hono!');
});

app.get('/env', (c) => {
  return c.text(c.env.NODE_ENV);
});

export default app;
