import "./App.css";
import { TodoWrapperLocalStorage } from "./components/Task/TodoWrapperLocalStorage";
import TimerWrapper from "./components/Timer/TimerWrapper";

function App() {
  return (
    <>
      <div className="App flex flex-col justify-center items-center">
        <div className="flex justify-center w-full mb-8">  
          <TimerWrapper />
        </div>
        <TodoWrapperLocalStorage />
      </div>
    </>
  );
}

export default App;
