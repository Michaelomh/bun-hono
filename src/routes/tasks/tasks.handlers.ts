import { eq } from 'drizzle-orm';

import type { AppRouteHandler } from '@/types';

import { dbInstance } from '@/db';
import { tasks } from '@/db/schema';
import { customLogger } from '@/middleware/logger';
import * as HttpStatusCodes from '@/utils/http-status-codes';

import type { CreateTasksRoute, DeleteTasksRoute, getOneTaskRoute, ListAllTasksRoute, UpdateTasksRoute } from './tasks.routes';

export const listAllTasks: AppRouteHandler<ListAllTasksRoute> = async (c) => {
  customLogger('retrieving all tasks');
  const db = dbInstance(c);
  const result = await db.select().from(tasks).all();
  return c.json(result);
};

export const createTask: AppRouteHandler<CreateTasksRoute> = async (c) => {
  const body = c.req.valid('json');
  customLogger('creating task');
  const db = dbInstance(c);
  const [result] = await db.insert(tasks).values(body).returning();
  return c.json(result, HttpStatusCodes.OK);
};

export const deleteTask: AppRouteHandler<DeleteTasksRoute> = async (c) => {
  const { id } = c.req.valid('param');
  customLogger('deleting one task');
  const db = dbInstance(c);
  const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  return c.json(result.length > 0, HttpStatusCodes.OK);
};

export const updateTask: AppRouteHandler<UpdateTasksRoute> = async (c) => {
  const body = c.req.valid('json');
  const { id } = c.req.valid('param');
  customLogger('updating task');
  const db = dbInstance(c);
  const [result] = await db.select().from(tasks).where(eq(tasks.id, id));

  if (!result) {
    return c.json({ message: `Task id: ${id} is not found in the database.` }, HttpStatusCodes.NOT_FOUND);
  }

  const [updatedTask] = await db.update(tasks).set(body).where(eq(tasks.id, id)).returning();
  return c.json(updatedTask, HttpStatusCodes.OK);
};

export const getOneTask: AppRouteHandler<getOneTaskRoute> = async (c) => {
  const { id } = c.req.valid('param');
  customLogger('creating one task');
  const db = dbInstance(c);
  const [result] = await db.select().from(tasks).where(eq(tasks.id, id));

  if (!result) {
    return c.json({ message: `Task id: ${id} is not found in the database.` }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json(result, HttpStatusCodes.OK);
};
