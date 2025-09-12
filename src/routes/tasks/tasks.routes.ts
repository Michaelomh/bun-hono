import { createRoute, z } from '@hono/zod-openapi';

import { insertTasksSchema, selectTasksSchema, updateTasksSchema } from '@/db/schema';
import createErrorSchema from '@/utils/create-error-schema';
import * as HttpStatusCodes from '@/utils/http-status-codes';
import IdParamsSchema from '@/utils/id-params-schema';
import jsonContent from '@/utils/json-content';
import jsonContentRequired from '@/utils/json-content-required';

const tags = ['tasks'];
const path = 'tasks';

export const listAllTasks = createRoute({
  method: 'get',
  tags,
  path,
  operationId: 'listAllTasks',
  summary: 'Get all tasks',
  description: 'Retrieve a list of all tasks',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTasksSchema),
      'List all tasks',
    ),
  },
});

export const createTask = createRoute({
  method: 'post',
  tags,
  path,
  operationId: 'createTask',
  summary: 'Create a new task',
  description: 'Creates a new task with the provided information',
  request: {
    body: jsonContentRequired(
      insertTasksSchema,
      'The task to create',
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      'Create a new Task',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema),
      'Validation Error(s)',
    ),
  },
});

export const deleteTask = createRoute({
  method: 'delete',
  tags,
  path: 'tasks/{id}',
  operationId: 'deleteTask',
  summary: 'Delete a task',
  description: 'Permanently deletes a task by its ID',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.boolean(),
      'Delete task by Id',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id format',
    ),
  },
});

export const updateTask = createRoute({
  method: 'patch',
  tags,
  path: 'tasks/{id}',
  operationId: 'updateTask',
  summary: 'Update a task',
  description: 'Updates an existing task with the provided information',
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      updateTasksSchema,
      'The task to update',
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      'Update task',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      'Task not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateTasksSchema).or(createErrorSchema(IdParamsSchema)),
      'Validation Error(s)',
    ),
  },
});

export const getOneTask = createRoute({
  method: 'get',
  tags,
  path: 'tasks/{id}',
  operationId: 'getOneTask',
  summary: 'Get a task by ID',
  description: 'Retrieves a specific task by its unique identifier',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      'Retrieve task by Id',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      'Task not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id format',
    ),
  },
});

export type ListAllTasksRoute = typeof listAllTasks;
export type CreateTasksRoute = typeof createTask;
export type DeleteTasksRoute = typeof deleteTask;
export type UpdateTasksRoute = typeof updateTask;
export type getOneTaskRoute = typeof getOneTask;
