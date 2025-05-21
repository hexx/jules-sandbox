import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem'; // This will now be the Card-based TaskItem

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string, completed: boolean) => void;
  onSplitTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDeleteTask, onToggleTask, onSplitTask }) => {
  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground mt-4">No tasks yet. Add one above!</p>;
  }
  return (
    <div className="space-y-3 mt-4"> {/* Added space-y for spacing between cards and margin-top */}
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onToggleComplete={onToggleTask}
          onSplitTask={onSplitTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
