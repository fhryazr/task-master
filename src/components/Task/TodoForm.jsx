/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import { TranscriptionContext } from "../../context/TranscriptionContext"

export const TodoForm = ({ addTodo, todos }) => {
  const [todoValue, setTodoValue] = useState("");
  const [taskValue, setTaskValue] = useState([todos]);
  const {commandScript} = useContext(TranscriptionContext);
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedValue = todoValue.trim();

    if (trimmedValue && !taskValue.includes(trimmedValue)) {
      addTodo(trimmedValue);
      setTodoValue("");
      setTaskValue([...taskValue, trimmedValue]);
    } else {
      alert(`Task ${todoValue} is already exist`)// Menampilkan pesan kesalahan
      setTodoValue('');
    }
  };

  const keywordAdd = [
    "buatkan tugas",
    "buatkan tas",
    "buatkan task",
    "tambahkan tugas",
    "tambahkan tas",
    "tambahkan task",
    "buat tugas",
    "buat tas",
    "buat task",
    "tambah tugas",
    "tambah tas",
    "tambah task",
  ];

  useEffect(() => {
    const lowerCommand = commandScript.toLowerCase();
  
    // Loop melalui array keywordAdd
    for (const key of keywordAdd) {
      if (lowerCommand.includes(key)) {
        // Temukan indeks kata kunci dalam transkrip
        const startIndex = lowerCommand.indexOf(key);
        // Ambil bagian transkrip setelah kata kunci
        let todoText = lowerCommand.substring(startIndex + key.length).trim();
        todoText = todoText.replace(/\.$/, '');
        // Periksa jika todoText memiliki isi (tidak hanya spasi)
        if (todoText) {
          // Panggil addTodo dengan todoText
          if (todoText && !taskValue.includes(todoText)) {
            addTodo(todoText);
            setTodoValue("");
            setTaskValue([...taskValue, todoText]);
          } else {
            setTodoValue('');
          }
        }
        break; // Keluar dari loop setelah menemukan kata kunci pertama
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandScript, addTodo]);
  

  return (
    <form
      onSubmit={handleSubmit}
      className="TodoForm flex flex-col items-center w-full gap-4 mb-4 drop-shadow-lg sm:flex-row">
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
        className="todo-btn w-full md:w-[8vw] lg:w-[5vw] xl:w-[4vw] py-1 h-11 bg-purple-900 text-white rounded-lg">
        {/* Tampilan tombol menyesuaikan dengan lebar layar */}
        <span className="inline text-md sm:hidden">Add Task</span>
        <span className="hidden sm:inline text-3xl">+</span>
      </button>
    </form>
  );
};
