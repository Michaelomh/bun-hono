import { createApp } from '@/app';
import index from '@/routes/index.routes';
import tasks from '@/routes/tasks/tasks.index';

import configureOpenApi from './lib/configure-open-api';

const app = createApp();

configureOpenApi(app);

// adds all routes
app.route('/', index);
app.route('/api', tasks);

// test routes
app.get('/env', (c) => {
  return c.text(c.env.NODE_ENV);
});

export default app;
