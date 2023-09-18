import "./App.css";
// import { TodoWrapper } from "./components/Task/TodoWrapper";
import { TodoWrapperLocalStorage } from "./components/Task/TodoWrapperLocalStorage";
import TimerWrapper from "./components/Timer/TimerWrapper";

function App() {
  return (
    <>
      <div className="App flex flex-col justify-center items-center">
        {/* <TodoWrapper /> */}
        <TimerWrapper />
        <TodoWrapperLocalStorage />
      </div>
    </>
  );
}

export default App;
