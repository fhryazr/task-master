import { TodoWrapperLocalStorage } from "../components/Task/TodoWrapperLocalStorage";
import TimerWrapper from "../components/Timer/TimerWrapper";
import AboutUs from "../components/About_Me/about";
import Tutorial from "../components/Tutorial/tutorial";
import FaQ from "../components/FAQ/faq";

function Home() {
  return (
    <>
      <div className="App flex flex-col justify-center items-center">
        <div className="flex justify-center w-full mb-8">
          <TimerWrapper />
        </div>
        <TodoWrapperLocalStorage />
        <div className="flex justify-center items-center w-[800px]">
          <AboutUs />
        </div>
        <div className="flex items-center w-[800px]">
          <Tutorial />
        </div>
        <div className="flex items-center w-[800px]">
          <FaQ />
        </div>
      </div>
    </>
  );
}

export default Home;
