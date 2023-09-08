import "./App.css";
// import { TodoWrapper } from "./components/Task/TodoWrapper";
import { TodoWrapperLocalStorage } from "./components/Task/TodoWrapperLocalStorage";

function App() {
  return (
    <>
      <div className="App flex justify-center items-center">
        {/* <TodoWrapper /> */}
        <TodoWrapperLocalStorage />
      </div>
    </>
  );
}

export default App;
