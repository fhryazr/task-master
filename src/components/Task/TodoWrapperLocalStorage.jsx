import { useState, useEffect } from "react";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "./Todo";
import { EditTodoForm } from "./EditTodoForm";

uuidv4(); //generate id untuk Task Baru

// Buat fungsi untuk mengambil data dari localStorage
const getTodosFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("todos")) || [];
};

// Buat fungsi untuk menyimpan data ke localStorage
const saveTodosToLocalStorage = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Komponen utama untuk manajemen tugas
export const TodoWrapperLocalStorage = () => {
  const [todos, setTodos] = useState(getTodosFromLocalStorage()); // State daftar tugas dari localStorage
  const [completedTodos, setCompletedTodos] = useState(0); // State untuk jumlah tugas yang sudah selesai

  useEffect(() => {
    // Hitung jumlah tugas yang sudah selesai saat komponen pertama kali dimuat
    const completedCount = todos.filter((todo) => todo.completed).length;
    setCompletedTodos(completedCount);
  }, [todos]);

  // Fungsi untuk menambahkan tugas baru
  const addTodo = (todo) => {
    const newTodos = [
      ...todos,
      { id: uuidv4(), task: todo, completed: false, isEditing: false },
    ];
    setTodos(newTodos);
    saveTodosToLocalStorage(newTodos);
  };

  // Fungsi untuk mengatur status tugas (selesai atau belum selesai)
  const toggleComplete = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    saveTodosToLocalStorage(newTodos);

    // Hitung ulang jumlah tugas yang sudah selesai setiap kali ada perubahan
    const completedCount = newTodos.filter((todo) => todo.completed).length;
    setCompletedTodos(completedCount);
  };

  // Fungsi untuk menghapus tugas
  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    saveTodosToLocalStorage(newTodos);

    // Hitung ulang jumlah tugas yang sudah selesai setelah menghapus tugas
    const completedCount = newTodos.filter((todo) => todo.completed).length;
    setCompletedTodos(completedCount);
  };

  // Fungsi untuk mengedit tugas
  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  // Fungsi untuk menyimpan tugas yang telah diedit
  const saveEditTask = (task, id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
    );
    setTodos(newTodos);
    saveTodosToLocalStorage(newTodos);
  };

  // Fungsi untuk menghapus tugas yang sudah selesai
  const clearCompleted = () => {
    if (completedTodos === 0) {
      alert("belum ada tugas yang selesai")
    }
    const unclearTodos = todos.filter((todo) => !todo.completed);
    setTodos(unclearTodos);
    saveTodosToLocalStorage(unclearTodos);
    setCompletedTodos(0);
  }
  
  return (
    <div className="TodoWrapper container w-[95vw] sm:w-[70vw] lg:w-[50vw]">
      <h1 className="mb-2 font-semibold text-xl text-white">Task Today</h1>
      <TodoForm addTodo={addTodo} />
      <div className="TodoList bg-slate-100 px-3 pb-2 rounded-md drop-shadow-lg">
        <div className="h-[30vh] px-2 py-2 overflow-y-auto">
          {todos.length === 0 ? (
            <h1 className="flex h-full justify-center items-center text-xl text-gray-400">No Task For Today</h1>
          ) : (
            todos.map((todo) =>
              todo.isEditing ? (
                <EditTodoForm key={todo.id} editTodo={saveEditTask} task={todo} />
              ) : (
                <Todo
                  task={todo}
                  key={todo.id}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                />
              )
            )
          )}
        </div>
        <div className="flex justify-between text-gray-400 cursor-default text-xs mt-4 pt-2 sm:flex-row sm:mt-0">
          <span>{Math.max(todos.length - completedTodos, 0)} task left</span>
          <span className="hidden sm:inline">{Math.max(completedTodos, 0)} Completed</span>
          <button className="cursor-pointer text-black" onClick={clearCompleted}>Clear Completed</button>
        </div>
      </div>
    </div>
  );
};
