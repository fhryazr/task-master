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
    <form onSubmit={handleSubmit} className="TodoForm flex w-[50rem] gap-4 h-10">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="todo-input w-full rounded-lg px-5"
        placeholder="Update task"
      />
      <button type="submit" className="todo-btn px-4 py-1 bg-purple-900 text-white rounded-lg">
        Edit
      </button>
    </form>
  );
};
