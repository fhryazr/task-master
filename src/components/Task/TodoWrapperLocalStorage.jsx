/* eslint-disable react-hooks/exhaustive-deps */
// TodoWrapperLocalStorage.js
import { useState, useEffect, useCallback, useContext } from "react";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "./Todo";
import { EditTodoForm } from "./EditTodoForm";
import { db } from "../../config/FirebaseConfig";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  doc,
  setDoc,
  where,
  query,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
// import "./Todo.css"; // Impor file CSS dengan gaya tambahan

uuidv4();

const TodoWrapperLocalStorage = () => {
  // const [user, setUser] = useState(null);
  const [completedTodos, setCompletedTodos] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [todos, setTodos] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const user = currentUser;

  const getTodosFromFirestore = useCallback(async () => {
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(db, "users", userId);
      const todosRef = collection(userDocRef, "todos");

      try {
        const todosQuerySnapshot = await getDocs(todosRef);
        const todos = [];

        todosQuerySnapshot.forEach((doc) => {
          todos.push({ id: doc.id, ...doc.data() });
        });

        Cookies.set(userId, JSON.stringify(todos), { expires: 365 });
        console.log(todos);
        return todos;
      } catch (error) {
        console.error("Error getting todos from Firestore:", error);
        return [];
      }
    }
    return [];
  }, [user]);

  const getTodosFromCookies = useCallback(() => {
    if (user) {
      const userId = user.uid;
      const todosFromCookies = Cookies.get(userId);
      if (todosFromCookies) {
        return JSON.parse(todosFromCookies) || [];
      } else {
        getTodosFromFirestore();
      }
    }
    return [];
  }, [user, getTodosFromFirestore]);

  const getTodos = useCallback(async () => {
    const todosFromCookies = getTodosFromCookies();

    if (todosFromCookies.length > 0) {
      return todosFromCookies;
    } else {
      const todosFromFirestore = await getTodosFromFirestore();
      return todosFromFirestore;
    }
  }, [getTodosFromFirestore, getTodosFromCookies]);

  const saveTodosToLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const fetchTodoData = useCallback(async () => {
    if (user!=null) {
      const userTodos = await getTodos();
      setTodos(userTodos);
    } else {
      const localTodos = JSON.parse(localStorage.getItem("todos")) || [];
      setTodos(localTodos);
    }
  }, [user]);

  useEffect(() => {
    fetchTodoData();
  }, [user]);

  useEffect(() => {
    const completedCount = todos.filter((todo) => todo.completed).length;
    setCompletedTodos(completedCount);
  }, [todos]);

  // eslint-disable-next-line no-unused-vars
  const addTodo = async (todo) => {
    const newTodo = {
      id: uuidv4(),
      task: todo,
      completed: false,
      isEditing: false,
    };

    if (user) {
      const userId = user.uid;

      // Step 1: Save the new todo to Cookies
      const todosFromCookies = Cookies.get(userId) || "[]"; // Ensure it's a JSON string
      const parsedTodos = JSON.parse(todosFromCookies) || [];
      parsedTodos.push(newTodo);
      Cookies.set(userId, JSON.stringify(parsedTodos), { expires: 365 });

      fetchTodoData();

      try {
        // Step 2: Send the data to Firestore
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const todosRef = collection(userDocRef, "todos");
          const todosCollectionSnapshot = await getDocs(todosRef);

          if (todosCollectionSnapshot.empty) {
            await setDoc(todosRef.doc(), {}); // Create an empty document for "todos"
          }

          await addDoc(todosRef, newTodo);
        } else {
          const newUserDocRef = doc(db, "users", userId);
          await setDoc(newUserDocRef, {}); // Create an empty user document
          const todosRef = collection(newUserDocRef, "todos");
          await addDoc(todosRef, newTodo);
        }
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    } else {
      // Handle the case when the user is not logged in
      const newTodos = [...todos, newTodo];
      setTodos(newTodos);
      saveTodosToLocalStorage(newTodos);
    }
    
  };

  const toggleComplete = async (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    if (user) {
      const userId = user.uid;

      // Update the completed status in Cookies
      const todosFromCookies = Cookies.get(userId) || "[]";
      const parsedTodos = JSON.parse(todosFromCookies) || [];
      const updatedTodos = parsedTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );

      Cookies.set(userId, JSON.stringify(updatedTodos), { expires: 365 });

      try {
        // Send the updated data to Firestore
        const userDocRef = doc(db, "users", userId);
        const todosRef = collection(userDocRef, "todos");
      
        // Buat query dengan kondisi where "id" == todo.id
        const q = query(todosRef, where("id", "==", id));
      
        const querySnapshot = await getDocs(q);
      
        querySnapshot.forEach(async (doc) => {
          const todo = doc.data();
      
          // Anda memiliki dokumen yang sesuai dengan todo.id di sini
          // console.log(doc.id); // ID dokumen
          // console.log(todo); // Data dokumen
      
          // Perbarui dokumen sesuai dengan nilai yang diinginkan
          await setDoc(doc.ref, {
            id: todo.id,
            task: todo.task,
            completed: !todo.completed,
            isEditing: todo.isEditing,
          });
        });
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    } else {
      // Handle the case when the user is not logged in
      saveTodosToLocalStorage(newTodos);
    }

    // Langsung memperbarui UI
    setTodos(newTodos);

    const completedCount = newTodos.filter((todo) => todo.completed).length;
    setCompletedTodos(completedCount);
  };

  const deleteTodo = async (id) => {
    // Filter todos untuk menghapus todo yang memiliki ID yang sesuai
    const newTodos = todos.filter((todo) => todo.id !== id);
  
    if (user) {
      const userId = user.uid;
  
      // Update Cookies: Hapus todo yang memiliki ID yang sesuai
      const todosFromCookies = Cookies.get(userId) || "[]";
      const parsedTodos = JSON.parse(todosFromCookies) || [];
      const updatedTodos = parsedTodos.filter((todo) => todo.id !== id);
  
      Cookies.set(userId, JSON.stringify(updatedTodos), { expires: 365 });
  
      try {
        // Send the updated data to Firestore
        const userDocRef = doc(db, "users", userId);
        const todosRef = collection(userDocRef, "todos");
  
        // Buat query dengan kondisi where "id" == id
        const q = query(todosRef, where("id", "==", id));
  
        const querySnapshot = await getDocs(q);
  
        querySnapshot.forEach(async (doc) => {
          // Hapus dokumen yang memiliki ID yang sesuai
          await deleteDoc(doc.ref);
        });
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    } else {
      // Handle the case when the user is not logged in
      saveTodosToLocalStorage(newTodos);
    }
  
    // Langsung memperbarui UI
    setTodos(newTodos);
  
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

  const saveEditTask = async (task, id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
    );
  
    if (user) {
      const userId = user.uid;
  
      // Update Cookies: Perbarui tugas yang memiliki ID yang sesuai
      const todosFromCookies = Cookies.get(userId) || "[]";
      const parsedTodos = JSON.parse(todosFromCookies) || [];
      const updatedTodos = parsedTodos.map((todo) =>
        todo.id === id ? { ...todo, task } : todo
      );
  
      Cookies.set(userId, JSON.stringify(updatedTodos), { expires: 365 });
  
      try {
        // Send the updated data to Firestore
        const userDocRef = doc(db, "users", userId);
        const todosRef = collection(userDocRef, "todos");
  
        // Buat query dengan kondisi where "id" == id
        const q = query(todosRef, where("id", "==", id));
  
        const querySnapshot = await getDocs(q);
  
        querySnapshot.forEach(async (doc) => {
          // Perbarui dokumen sesuai dengan nilai yang diinginkan
          await updateDoc(doc.ref, {
            task,
          });
        });
      } catch (error) {
        console.error("Error updating edited todo:", error);
      }
    } else {
      // Handle the case when the user is not logged in
      saveTodosToLocalStorage(newTodos);
    }
  
    // Langsung memperbarui UI
    setTodos(newTodos);
  };

  const clearCompleted = async () => {
    // Periksa apakah ada tugas yang telah selesai
    if (completedTodos === 0) {
      // Tampilkan peringatan jika tidak ada tugas yang telah selesai
      alert("belum ada tugas yang selesai");
      return;
    }
  
    const newTodos = todos.filter((todo) => !todo.completed);
  
    if (user) {
      const userId = user.uid;
  
      // Perbarui Cookies: Hapus tugas yang telah selesai
      const todosFromCookies = Cookies.get(userId) || "[]";
      const parsedTodos = JSON.parse(todosFromCookies) || [];
      const updatedTodos = parsedTodos.filter((todo) => !todo.completed);
  
      // Simpan data yang telah diperbarui ke Cookies
      Cookies.set(userId, JSON.stringify(updatedTodos), { expires: 365 });
  
      try {
        // Send the updated data to Firestore: Hapus tugas yang telah selesai
        const userDocRef = doc(db, "users", userId);
        const todosRef = collection(userDocRef, "todos");
  
        // Buat query dengan kondisi where "completed" == true
        const q = query(todosRef, where("completed", "==", true));
  
        // Dapatkan daftar tugas yang telah selesai
        const querySnapshot = await getDocs(q);
  
        querySnapshot.forEach(async (doc) => {
          // Hapus dokumen sesuai dengan kondisi
          await deleteDoc(doc.ref);
        });
      } catch (error) {
        console.error("Error clearing completed todos:", error);
      }
    } else {
      // Handle the case when the user is not logged in
      // Perbarui tugas yang belum selesai
      saveTodosToLocalStorage(newTodos);
    }
  
    // Langsung memperbarui UI dengan tugas yang belum selesai
    setTodos(newTodos);
    // Set jumlah tugas yang telah selesai menjadi 0
    setCompletedTodos(0);
  };

  return (
    <div className="TodoWrapper container w-[95vw] sm:w-[70vw] lg:w-[50vw]">
      <h1 className="mb-2 font-semibold text-xl text-white">Task Today</h1>
      <TodoForm addTodo={addTodo} />
      <div className="TodoList bg-slate-100 px-3 pb-2 rounded-md drop-shadow-lg">
        <div className="h-[30vh] px-2 py-2 overflow-y-auto hover:overflow-y-auto">
          {todos.length === 0 ? (
            <h1 className="flex h-full justify-center items-center text-xl text-gray-400">
              No Task For Today
            </h1>
          ) : (
            todos.map((todo) =>
              todo.isEditing ? (
                <EditTodoForm
                  key={todo.id}
                  editTodo={saveEditTask}
                  task={todo}
                />
              ) : (
                <Todo
                  task={todo}
                  key={todo.id}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                  isSelected={selectedTask === todo.id} // Mengirimkan prop isSelected
                  setSelected={setSelectedTask} // Mengirimkan prop setSelected
                />
              )
            )
          )}
        </div>
        <div className="flex justify-between text-gray-400 cursor-default text-xs mt-4 pt-2 sm:flex-row sm:mt-0">
          <span>{Math.max(todos.length - completedTodos, 0)} task left</span>
          <span className="hidden sm:inline">
            {Math.max(completedTodos, 0)} Completed
          </span>
          <button
            className="cursor-pointer text-black"
            onClick={clearCompleted}>
            Clear Completed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoWrapperLocalStorage;
