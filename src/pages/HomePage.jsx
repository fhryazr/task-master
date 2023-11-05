import Navbar from "../components/Navbar/navbar";
// import TestNavbar from "../components/Navbar/testNavbar";
import TimerWrapper from "../components/Timer/TimerWrapper";
import TodoWrapperLocalStorage from "../components/Task/TodoWrapperLocalStorage";
import AboutUs from "../components/About_Me/about";
import Tutorial from "../components/Tutorial/tutorial";
import FaQ from "../components/FAQ/faq";
import "../App.css";
import BgmWrapper from "../components/bgm/BgmWrapper";

function HomePage() {
  return (
    <>
      <div className="App container">
        <div className="flex justify-center w-full px-2">
          <Navbar />
          {/* <TestNavbar /> */}
        </div>
        <div className="flex flex-col items-center">
          <div className="Top h-[142vh] flex flex-col justify-center items-center mb-2 pt-16 md:h-[120vh] lg:h-[100vh]">
            <div className="flex flex-col justify-center items-center w-full gap-10 mb-8 mt-[-100px] lg:flex-row">
              <TimerWrapper />
              <BgmWrapper />
            </div>
            <TodoWrapperLocalStorage />
          </div>
          <div className="Bottom bg-white w-[100vw] flex flex-col items-center gap-5 ">
            <div className="" id="about-us">
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
      </div>
    </>
  );
}

export default HomePage;
