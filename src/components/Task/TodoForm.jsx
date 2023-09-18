/* eslint-disable react/prop-types */
import { useState } from "react";

export const TodoForm = ({ addTodo }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    // prevent default action
    e.preventDefault();
    if (value) {
      // add todo
      addTodo(value);
      // clear form after submission
      setValue("");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="TodoForm flex w-full gap-4 mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="todo-input w-full rounded-lg px-8"
        placeholder="Create a new task"
      />
      <button
        type="submit"
        className="todo-btn text-3xl px-4 py-1 bg-purple-900 text-white rounded-lg"
      >
        +
      </button>
    </form>
  );
};
