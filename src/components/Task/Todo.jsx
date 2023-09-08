/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete }) => {
  return (
    <div className="Todo bg-slate-50 flex justify-between items-center h-12 px-5 py-1 mb-4 mt-4 rounded-lg drop-shadow-md">
      <div className="flex justify-center items-center gap-4">
        <FontAwesomeIcon className="cursor-pointer h-5" icon={faCircleCheck} onClick={() => toggleComplete(task.id)}/>
        <p className={`${task.completed ? "completed" : ""}`}>
          {task.task}
        </p>
      </div>
      <div className="flex items-center gap-5">
        <FontAwesomeIcon
          icon={faPenToSquare}
          onClick={() => editTodo(task.id)}
        />
        <FontAwesomeIcon icon={faTrash} onClick={() => deleteTodo(task.id)} />
      </div>
    </div>
  );
};
