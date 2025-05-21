import { Hono } from 'hono/';
import { Task } from '../types.ts';
import { OpenAI } from "openai";
import { experimental_generateObject } from "ai";
import { z } from "zod";

const app = new Hono();
export { app as tasksApp }; // Export for testing (optional, if testing task routes in isolation)
export let tasks: Task[] = []; // Export for test manipulation

// GET /api/tasks
app.get('/', (c) => {
  return c.json(tasks);
});

// POST /api/tasks
app.post('/', async (c) => {
  const { text } = await c.req.json<{ text: string }>();
  if (!text) {
    return c.json({ error: 'Text is required' }, 400);
  }
  const newTask: Task = {
    id: crypto.randomUUID(),
    text,
    completed: false,
  };
  tasks.push(newTask);
  return c.json(newTask, 201);
});

// DELETE /api/tasks/:id
app.delete('/:id', (c) => {
  const id = c.req.param('id');
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  if (tasks.length < initialLength) {
    return c.body(null, 204);
  } else {
    return c.json({ error: 'Task not found' }, 404);
  }
});

// PATCH /api/tasks/:id
app.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return c.json({ error: 'Task not found' }, 404);
  }

  const { text, completed } = await c.req.json<{ text?: string; completed?: boolean }>();
  const currentTask = tasks[taskIndex];

  if (text !== undefined) {
    currentTask.text = text;
  }
  if (completed !== undefined) {
    currentTask.completed = completed;
  }

  tasks[taskIndex] = currentTask;
  return c.json(currentTask);
});

app.post('/:id/split', async (c) => {
  const id = c.req.param('id');
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return c.json({ error: 'Task not found' }, 404);
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return c.json({ error: 'OPENAI_API_KEY is not set' }, 500);
  }

  const openaiClient = new OpenAI({ apiKey });

  try {
    const { object } = await experimental_generateObject({
      model: openaiClient.chat.completions, // Correct model reference
      schema: z.object({
        subtasks: z.array(z.string()).min(2).max(4).describe("An array of 2 to 4 subtask strings"),
      }),
      prompt: `Split the following task into 2 to 4 smaller, actionable subtasks: "${task.text}".`,
      messages: [{role: "user", content: `Split the following task into 2 to 4 smaller, actionable subtasks: "${task.text}".`}] // Pass messages array
    });

    const newSubtasks: Task[] = [];
    if (object && object.subtasks) {
      for (const subtaskText of object.subtasks) {
        const newSubtask: Task = {
          id: crypto.randomUUID(),
          text: `Sub: ${subtaskText} (from: ${task.id.substring(0,4)})`, // Indicate it's a subtask and parent
          completed: false,
          // parentId: id, // Optional: if you add parentId to Task type
        };
        tasks.push(newSubtask);
        newSubtasks.push(newSubtask);
      }
    }
    return c.json(newSubtasks, 200);
  } catch (error) {
    console.error('AI task splitting error:', error);
    return c.json({ error: 'Failed to split task using AI.', details: error.message }, 500);
  }
});

export default app;
