export interface Task {
  id: string;
  text: string;
  completed: boolean;
  parentId?: string; // Optional: to link subtasks
}
