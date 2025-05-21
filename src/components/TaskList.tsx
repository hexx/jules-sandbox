import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string, completed: boolean) => void;
  onSplitTask: (id: string) => void; // New prop
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDeleteTask, onToggleTask, onSplitTask }) => {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onToggleComplete={onToggleTask}
          onSplitTask={onSplitTask} // Pass prop
        />
      ))}
    </div>
  );
};

export default TaskList;
