/* eslint-disable react/prop-types */
import { useState } from "react";

export const TodoForm = ({ addTodo }) => {
  const [todoValue, setTodoValue] = useState("");

  //handler submit form
  const handleSubmit = (e) => {
    // prevent default action
    e.preventDefault();
    if (todoValue) {
      addTodo(todoValue); // menambahkan task baru dengan fungsi addTodo dari prop
      setTodoValue(""); //mengosongkan form setelah submit
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="TodoForm flex flex-col w-full gap-4 mb-4 drop-shadow-lg sm:flex-row">
      <div className="w-full">
        {/* form input untuk menambahkan tugas */}
        <input
          type="text"
          value={todoValue}
          onChange={(e) => setTodoValue(e.target.value)}
          className="todo-input w-full rounded-lg px-2 py-1 h-11 sm:px-8"
          placeholder="Create a new task"
        />
      </div>

      {/* Button menambahkan tugas */}
      <button
        type="submit"
        className="todo-btn px-4 py-1 h-11 bg-purple-900 text-white rounded-lg">
        {/* Tampilan tombol menyesuaikan dengan lebar layar */}
        <span className="inline text-md sm:hidden">Add Task</span> 
        <span className="hidden sm:inline text-3xl">+</span>
      </button>
    </form>
  );
};
