import { jsonb, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { Edge } from '@xyflow/react'

import type { StepNodeType } from '@/features/workflows/nodes/node-registry';

export type WorkflowGraph = { nodes: StepNodeType[]; edges: Edge[] }


export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: text('org_id').notNull(),
  name: text('name').notNull(),
  graph: jsonb('graph'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Workflow = typeof workflows.$inferSelect;
