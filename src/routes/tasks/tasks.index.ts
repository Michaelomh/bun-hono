import { createRouter } from '@/app';

import * as handlers from './tasks.handlers';
import * as routes from './tasks.routes';

const router = createRouter()
  .openapi(routes.listAllTasks, handlers.listAllTasks)
  .openapi(routes.createTask, handlers.createTask)
  .openapi(routes.deleteTask, handlers.deleteTask)
  .openapi(routes.updateTask, handlers.updateTask)
  .openapi(routes.getOneTask, handlers.getOneTask);

export default router;
