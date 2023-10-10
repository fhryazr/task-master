import TodoWrapperLocalStorage from "../components/Task/TodoWrapperLocalStorage";
import TimerWrapper from "../components/Timer/TimerWrapper";
import AboutUs from "../components/About_Me/about";
import Tutorial from "../components/Tutorial/tutorial";
import FaQ from "../components/FAQ/faq";
import Navbar from "../components/Navbar/navbar";

function HomePage() {
  return (
    <>
      <div className="App flex flex-col justify-center items-center">
        <Navbar />
        <div className="flex justify-center w-full mb-8">
          <TimerWrapper />
        </div>
        <TodoWrapperLocalStorage />
        <div
          className="flex justify-center items-center w-[800px]"
          id="about-us"
        >
          <AboutUs />
        </div>
        <div className="flex items-center w-[800px]" id="tutorial">
          <Tutorial />
        </div>
        <div className="flex items-center w-[800px]" id="FAQ">
          <FaQ />
        </div>
      </div>
    </>
  );
}

export default HomePage;
