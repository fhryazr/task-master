/* eslint-disable react/prop-types */
import { useState } from "react";

// EditTodoForm digunakan untuk mengedit tugas yang ada
export const EditTodoForm = ({ editTodo, task }) => {
  const [editedTask, setEditedTask] = useState(task.task);

  const handleSubmit = (e) => {
    // prevent default action
    e.preventDefault();
    editTodo(editedTask, task.id);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="TodoForm flex h-12 mb-4 mt-4 rounded-lg drop-shadow-md gap-4"
    >
      {/* Input Edited Task User */}
      <input
        type="text"
        value={editedTask}
        onChange={(e) => setEditedTask(e.target.value)}
        className="todo-input w-full rounded-lg px-8"
        placeholder="Update task"
      />

      {/* Button Save Edited Task */}
      <button
        type="submit"
        className="todo-btn px-4 py-1 bg-purple-900 text-white rounded-lg"
      >
        Save
      </button>
    </form>
  );
};
