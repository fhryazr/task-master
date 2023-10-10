import TodoWrapperLocalStorage from "../components/Task/TodoWrapperLocalStorage";
import TimerWrapper from "../components/Timer/TimerWrapper";
import AboutUs from "../components/About_Me/about";
import Tutorial from "../components/Tutorial/tutorial";
import FaQ from "../components/FAQ/faq";
import "../App.css";

function HomePage() {
  return (
    <>
      <div className="App flex flex-col justify-center items-center">
        <div className="flex justify-center w-full">
          <TimerWrapper />
        </div>
        <TodoWrapperLocalStorage />
      </div>
      <div className="About flex flex-col justify-center items-center gap-[3rem]">
        <div className="w-[800px]">
          <AboutUs />
        </div>
        <div className="w-[800px]">
          <Tutorial />
        </div>
        <div className="w-[800px]">
          <FaQ />
        </div>
      </div>
    </>
  );
}

export default HomePage;
