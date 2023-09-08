/* eslint-disable react/prop-types */

import { useState } from "react";

export const EditTodoForm = ({ editTodo, task }) => {
  const [value, setValue] = useState(task.task);

  const handleSubmit = (e) => {
    // prevent default action
    e.preventDefault();
    // edit todo
    editTodo(value, task.id);
  };
  return (
    <form onSubmit={handleSubmit} className="TodoForm flex h-12 mb-4 mt-4 rounded-lg drop-shadow-md gap-4">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="todo-input w-full rounded-lg px-8"
        placeholder="Update task"
      />
      <button type="submit" className="todo-btn px-4 py-1 bg-purple-900 text-white rounded-lg">
        Save
      </button>
    </form>
  );
};
