import React from 'react';
import { Task } from '../types';
import { Button } from "@/components/ui/button.tsx"; // Ensure .tsx for Deno
import { Checkbox } from "@/components/ui/checkbox.tsx"; // Ensure .tsx for Deno
import { Label } from "@/components/ui/label.tsx"; // Ensure .tsx for Deno
import { Card, CardContent } from "@/components/ui/card.tsx"; // Ensure .tsx for Deno
import { cn } from '@/lib/utils.ts'; // Ensure .ts for Deno

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onSplitTask: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggleComplete, onSplitTask }) => {
  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      onToggleComplete(task.id, checked);
    }
  };

  return (
    <Card className="mb-2 shadow">
      <CardContent className="p-4 flex items-center gap-3"> {/* Use gap for spacing children */}
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleCheckedChange}
          aria-labelledby={`label-task-${task.id}`}
        />
        <Label
          htmlFor={`task-${task.id}`}
          id={`label-task-${task.id}`}
          className={cn(
            "flex-grow text-base", // text-base for slightly larger text
            task.completed ? "line-through text-muted-foreground" : ""
          )}
        >
          {task.text}
        </Label>
        <div className="ml-auto flex space-x-2"> {/* Ensure buttons are grouped and spaced */}
          <Button variant="outline" size="sm" onClick={() => onSplitTask(task.id)}>
            Split
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
