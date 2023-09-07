/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete }) => {
  return (
    <div className="Todo bg-slate-50 flex justify-between items-center px-5 py-1 mb-4 mt-4 rounded-lg h-10">
      <p
        className={`${task.completed ? "completed" : ""}`}
        onClick={() => toggleComplete(task.id)}>
        {task.task}
      </p>
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
