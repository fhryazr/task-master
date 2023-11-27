import Navbar from "../components/Navbar/navbar";
import TimerWrapper from "../components/Timer/TimerWrapper";
import TodoWrapperLocalStorage from "../components/Task/TodoWrapperLocalStorage";
import AboutUs from "../components/About_Me/about";
import Tutorial from "../components/Tutorial/tutorial";
import FaQ from "../components/FAQ/faq";
import "../App.css";
import BgmWrapper from "../components/bgm/BgmWrapper";
import VoiceCommand from "../components/Voice/VoiceCommand";
import TestNavbar from "../components/Navbar/TestNavbar";

function HomePage() {
  return (
    <>
      <div className="App container">
        <div className="flex flex-col items-center">
          <div className="lg:h-[100vh]">
            <div className="flex justify-center w-full px-2 md:px-8 z-50 mb-12 md:mb-10 lg:mb-0">
              <div className="hidden lg:inline-block lg:w-full">
                <Navbar />
              </div>
              <div className="w-full lg:hidden">
                <TestNavbar />
              </div>
            </div>
            <div className="Top h-full flex flex-col justify-center items-center mb-2 pt-16">
              <div className="flex flex-col justify-center items-center w-full gap-5 md:gap-10 mb-8 mt-[-100px] lg:flex-row">
                <TimerWrapper />
                <BgmWrapper />
              </div>
              <TodoWrapperLocalStorage />
            </div>
          </div>
            <div className="flex justify-end sticky bottom-0 w-screen p-5 px-8">
              <div>
                <VoiceCommand />
              </div>
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
