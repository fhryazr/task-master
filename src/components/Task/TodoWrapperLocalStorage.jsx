import { useState, useEffect } from "react";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "./Todo";
import { EditTodoForm } from "./EditTodoForm";
uuidv4();

export const TodoWrapperLocalStorage = () => {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState(0); // State untuk tugas yang sudah selesai

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(savedTodos);

    // Hitung jumlah tugas yang sudah selesai saat komponen pertama kali dimuat
    const completedCount = savedTodos.filter((todo) => todo.completed).length;
    setCompletedTodos(completedCount);
  }, []);

  const addTodo = (todo) => {
    const newTodos = [
      ...todos,
      { id: uuidv4(), task: todo, completed: false, isEditing: false },
    ];
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const toggleComplete = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));

    // Hitung ulang jumlah tugas yang sudah selesai setiap kali ada perubahan
    const completedCount = newTodos.filter((todo) => todo.completed).length;
    setCompletedTodos(completedCount);
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));

    // Hitung ulang jumlah tugas yang sudah selesai setelah menghapus tugas
    const completedCount = newTodos.filter((todo) => todo.completed).length;
    setCompletedTodos(completedCount);
  };

  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const editTask = (task, id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const clearCompleted = () => {
    if (completedTodos === 0) {
      alert("belum ada tugas yang selesai");
    }
    const unclearTodos = todos.filter((todo) => !todo.completed);
    setTodos(unclearTodos);
    localStorage.setItem("todos", JSON.stringify(unclearTodos));
    setCompletedTodos(0);
  };
  return (
    <div className="TodoWrapper w-[50vw]">
      <h1 className="mb-2 font-semibold text-xl text-white">Task Today</h1>
      <TodoForm addTodo={addTodo} />
      <div className="TodoList bg-slate-100 px-3 pb-2 rounded-md">
        <div className="h-[30vh] px-2 py-2 overflow-y-auto">
          {todos.length === 0 ? (
            <h1 className="flex h-full justify-center items-center text-xl text-gray-400">
              No Task For Today
            </h1>
          ) : (
            todos.map((todo) =>
              todo.isEditing ? (
                <EditTodoForm key={todo.id} editTodo={editTask} task={todo} />
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
        <div className="flex justify-between text-gray-400 cursor-default">
          <span>{Math.max(todos.length - completedTodos, 0)} task left</span>
          <span>{Math.max(completedTodos, 0)} Completed</span>
          <span className="cursor-pointer text-black" onClick={clearCompleted}>
            Clear Completed
          </span>
        </div>
      </div>
    </div>
  );
};
