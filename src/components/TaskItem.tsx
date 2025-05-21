import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onSplitTask: (id: string) => void; // New prop
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggleComplete, onSplitTask }) => {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => onToggleComplete(task.id, e.target.checked)}
      />
      <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.text}
      </span>
      <button onClick={() => onDelete(task.id)}>Delete</button>
      <button onClick={() => onSplitTask(task.id)} style={{ marginLeft: '5px' }}>Split Task</button>
    </div>
  );
};

export default TaskItem;
