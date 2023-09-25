// Todo.js
/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck as farCheck } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck as fasCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete, isSelected, setSelected }) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);

  const handleCheckClick = () => {
    setIsCompleted(!isCompleted);
    toggleComplete(task.id);
  };

  return (
    <div
      className={`Todo bg-slate-100 flex w-full justify-between items-center px-5 py-5 mb-4 mt-4 gap-4 rounded-lg drop-shadow-md ${isSelected ? "bg-blue-100" : ""}`}
      onClick={() => setSelected(task.id)}
    >
      <FontAwesomeIcon
        className="cursor-pointer h-5"
        icon={isCompleted ? fasCheck : farCheck}
        onClick={handleCheckClick}
      />

      <div className="w-full overflow-x-auto">
        <p
          className={`text-left break-words ${isCompleted ? "completed" : ""}`}>
          {task.task}
        </p>
      </div>

      <div className="flex items-end gap-5">
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
