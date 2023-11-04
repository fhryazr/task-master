import TodoWrapperLocalStorage from "../components/Task/TodoWrapperLocalStorage";
import TimerWrapper from "../components/Timer/TimerWrapper";
import AboutUs from "../components/About_Me/about";
import Tutorial from "../components/Tutorial/tutorial";
import FaQ from "../components/FAQ/faq";
import Navbar from "../components/Navbar/navbar";
import "../App.css";

function HomePage() {
  return (
    <>
      <div className="App">
        <div className="top-0 sticky z-50">
          <Navbar />
        </div>
        <div className="Top h-screen flex flex-col justify-center items-center mb-4">
          <div className="flex justify-center w-full mb-8 mt-[-100px]">
            <TimerWrapper />
          </div>
          <TodoWrapperLocalStorage />
        </div>
        <div className="Bottom flex flex-col items-center">
          <div id="about-us">
            <AboutUs />
          </div>
          <div id="tutorial">
            <Tutorial />
          </div>
          <div id="FAQ">
            <FaQ />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
