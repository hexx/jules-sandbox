import React, { useState } from 'react';
import { Input } from "@/components/ui/input.tsx"; // Ensure .tsx for Deno
import { Button } from "@/components/ui/button.tsx"; // Ensure .tsx for Deno

interface AddTaskFormProps {
  onTaskAdd: (text: string) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onTaskAdd(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1"
      />
      <Button type="submit">Add Task</Button>
    </form>
  );
};

export default AddTaskForm;
