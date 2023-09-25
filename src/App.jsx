import "./App.css";
import { TodoWrapperLocalStorage } from "./components/Task/TodoWrapperLocalStorage";
import WaktuWrapper from "./components/waktu/WaktuWrapper";

function App() {
  return (
    <>
      <div className="App flex flex-col justify-center items-center">
        <div className="flex justify-center w-full mb-8">
          <WaktuWrapper />
        </div>
        <TodoWrapperLocalStorage />
      </div>
    </>
  );
}

export default App;
