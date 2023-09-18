/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck as farCheck } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck as fasCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

// Todo untuk menampung sebuah data dari TodoForm dan EditTodoForm 
export const Todo = ({ task, deleteTodo, editTodo, toggleComplete }) => {
  //state mengatur tugas (selesai atau belum selesai)
  const [isCompleted, setIsCompleted] = useState(task.completed);

  //handler icon check
  const handleCheckClick = () => {
    setIsCompleted(!isCompleted);
    toggleComplete(task.id);
  };

  return (
    <div className="Todo bg-slate-100 flex w-full justify-between items-center px-5 py-5 mb-4 mt-4 gap-4 rounded-lg drop-shadow-md">
      <div className="container w-[70%] flex items-center gap-4 sm:w-[85%] lg:w-[87%]">
        {/* Button Check Tugas */}
        <FontAwesomeIcon
          className="cursor-pointer h-5"
          icon={isCompleted ? fasCheck : farCheck}
          onClick={handleCheckClick}
        />

        <div className="w-full overflow-x-auto">
          {/* Desc Tugas */}
          <p
            className={`text-left break-words ${
              isCompleted ? "completed" : ""
            }`}>
            {task.task}
          </p>
        </div>
      </div>

      <div className="flex items-end gap-5">
        {/* Button Edit Task */}
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faPenToSquare}
          onClick={() => editTodo(task.id)}
        />

        {/* Button Hapus Task */}
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faTrash}
          onClick={() => deleteTodo(task.id)}
        />
      </div>
    </div>
  );
};
