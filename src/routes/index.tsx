import React, { useState, useEffect, useCallback } from 'react';
import { createFileRoute } from '@tanstack/router';
import { Task } from '../types';
import AddTaskForm from '../components/AddTaskForm';
import TaskList from '../components/TaskList';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (text: string) => {
    try {
      setError(null);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Failed to add task: ${response.status}` }));
        throw new Error(errorData.error || `Failed to add task: ${response.status}`);
      }
      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error("Add task error:", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Task with id ${id} not found.`);
        }
        throw new Error(`Failed to delete task: ${response.status}`);
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error("Delete task error:", err);
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      setError(null);
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Failed to update task: ${response.status}` }));
        throw new Error(errorData.error || `Failed to update task: ${response.status}`);
      }
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error("Toggle task error:", err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl"> {/* Main container with Tailwind classes */}
      {/* Removed h2 "Tasks" as the main h1 in App.tsx serves as overall title */}
      {/* Error display can be improved, perhaps with a dedicated Alert component later */}
      {error && (
        <p className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 border border-destructive/30">
          Error: {error}
        </p>
      )}
      <AddTaskForm onTaskAdd={handleAddTask} />
      <TaskList
        tasks={tasks}
        onDeleteTask={handleDeleteTask}
        onToggleTask={handleToggleTask}
        onSplitTask={handleSplitTask}
      />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: TasksPage,
});

// Helper function for splitting tasks (outside component for clarity)
async function handleSplitTaskLogic(taskId: string, setTasks: React.Dispatch<React.SetStateAction<Task[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) {
  try {
    setError(null);
    const response = await fetch(`/api/tasks/${taskId}/split`, {
      method: 'POST',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Failed to split task: ${response.status}` }));
      throw new Error(errorData.error || `Failed to split task: ${response.status}`);
    }
    // const newSubtasks: Task[] = await response.json(); // Not directly used as we refetch
    // setTasks(prevTasks => [...prevTasks, ...newSubtasks]);

    // Re-fetch all tasks to update the list with new subtasks
    const fetchResponse = await fetch('/api/tasks');
    if (!fetchResponse.ok) {
        throw new Error(`Failed to re-fetch tasks: ${fetchResponse.status}`);
    }
    const updatedTasks = await fetchResponse.json();
    setTasks(updatedTasks);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while splitting the task.';
    setError(errorMessage);
    console.error('Error splitting task:', err);
  }
}
