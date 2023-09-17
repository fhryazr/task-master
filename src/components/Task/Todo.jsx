/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck as farCheck } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck as fasCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete }) => {
  // State untuk mengatur ikon cek (farCheck atau fasCheck)
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckClick = () => {
    // Saat ikon cek diklik, toggle nilai isChecked
    setIsChecked(!isChecked);
    // Panggil fungsi toggleComplete untuk menandai tugas sebagai selesai atau belum selesai
    toggleComplete(task.id);
  };

  return (
    <div className="Todo bg-slate-50 flex justify-between items-center h-12 px-5 py-1 mb-4 mt-4 rounded-lg drop-shadow-md">
      <div className="flex justify-center items-center gap-4">
        <FontAwesomeIcon
          className="cursor-pointer h-5"
          icon={isChecked ? fasCheck : farCheck}
          onClick={handleCheckClick}
        />
        <p className={`${task.completed ? "completed" : ""}`}>{task.task}</p>
      </div>
      <div className="flex items-center gap-5">
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faPenToSquare}
          onClick={() => editTodo(task.id)}
        />
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faTrash}
          onClick={() => deleteTodo(task.id)}
        />
      </div>
    </div>
  );
};
