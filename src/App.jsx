import "./App.css";
// import { TodoWrapper } from "./components/Task/TodoWrapper";
import { TodoWrapperLocalStorage } from "./components/Task/TodoWrapperLocalStorage";
import TimerWrapper from "./components/Timer/TimerWrapper";

function App() {
  return (
    <>
      <div className="App flex justify-center items-center flex-col">
        {/* <TodoWrapper /> */}
        {/* <TimerWrapper /> */}
        <TimerWrapper />
        <TodoWrapperLocalStorage />
      </div>
    </>
  );
}

export default App;
