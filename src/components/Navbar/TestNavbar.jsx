import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { createPopper } from "@popperjs/core";
import { getAuth } from "firebase/auth";
import ProfilePopup from "./profil";
import StatsModal from "./StatsModal";
import BackgroundColorChanger from "../Background/background";
import Subscription from "./subscribe";
import Premium from "./premium";
import { AuthContext } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import DrawerBackground from "../Background/drawerBackground";

function TestNavbar() {
  const [showPopover, setShowPopover] = useState(false);
  const referenceElement = useRef(null);
  const popoverElement = useRef(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const user = currentUser;

  const getData = useCallback(async () => {
    const userId = user.uid;
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.data().status === "premium") {
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getData();
    } else {
      return;
    }
  }, [user, getData]);

  const [isPremium, setIsPremium] = useState(false);

  const openStatsModal = () => {
    setShowStatsModal(true);
  };

  const closeStatsModal = () => {
    setShowStatsModal(false);
  };

  useEffect(() => {
    if (showPopover) {
      createPopper(referenceElement.current, popoverElement.current, {
        placement: "bottom",
        modifiers: [
          {
            name: "preventOverflow",
            options: {
              altAxis: true,
            },
          },
        ],
      });
    }

    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, [showPopover]);

  const handlePopoverClick = () => {
    setShowPopover(!showPopover);
  };

  const scrollToContent = (contentId) => {
    const contentElement = document.getElementById(contentId);
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const options = [
    { label: "What is TaskMaster?", contentId: "about-us" },
    { label: "How to use?", contentId: "tutorial" },
    { label: "FAQ", contentId: "FAQ" },
  ];

  return (
    <div className="drawer z-50 bg-transparent">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar flex justify-center items-center bg-none">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 justify-between mx-2 text-white text-lg font-semibold">
            Task Master
            <div className="lg:hidden">
              {isLoggedIn ? (
                <a
                  className=""
                  onClick={() => {
                    setShowProfile(true); // Menampilkan pop-up profil
                  }}>
                  <ProfilePopup
                    showProfile={showProfile}
                    setShowProfile={setShowProfile}
                  />
                </a>
              ) : (
                <a href="login" className="text-white hover:text-blue-200">
                  Login
                </a>
              )}
            </div>
          </div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal flex items-center text-lg">
              {/* Navbar menu content here */}
              <li>{isPremium ? <Premium /> : <Subscription />}</li>
              <li>
                <BackgroundColorChanger />
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-blue-200"
                  onClick={handlePopoverClick}
                  ref={referenceElement}>
                  About
                </a>
                {showPopover && (
                  <div
                    className="bg-white border border-gray-300 p-4 rounded-lg shadow-md"
                    ref={popoverElement}>
                    <ul>
                      {options.map((option) => (
                        <li key={option.contentId}>
                          <a
                            href="#"
                            className="cursor-pointer hover:bg-gray-100 p-2 block"
                            onClick={() => {
                              scrollToContent(option.contentId);
                              setShowPopover(false);
                            }}>
                            {option.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-blue-200"
                  onClick={openStatsModal}>
                  Stats
                </a>
                <StatsModal show={showStatsModal} onClose={closeStatsModal} />
              </li>
              <li>
                {isLoggedIn ? (
                  <a
                    className=""
                    onClick={() => {
                      setShowProfile(true); // Menampilkan pop-up profil
                    }}>
                    <ProfilePopup
                      showProfile={showProfile}
                      setShowProfile={setShowProfile}
                    />
                  </a>
                ) : (
                  <a href="login" className="text-white hover:text-blue-200">
                    Login
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="lg:hidden drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"></label>
        <ul className="menu p-4 w-[90vw] md:w-80 min-h-full bg-black bg-opacity-90">
          {/* Sidebar content here */}
          <li>{isPremium ? <Premium /> : <Subscription />}</li>
          <li>
            <DrawerBackground />
          </li>
          <li className="-mt-5">
            <div className="collapse p-0 w-full">
              <input type="checkbox" />
              <div className="collapse-title">
                <a
                  href="#"
                  className="text-white hover:text-blue-200"
                  onClick={handlePopoverClick}
                  ref={referenceElement}>
                  About
                </a>
              </div>
              <div className="collapse-content">
                <ul>
                  {options.map((option) => (
                    <li key={option.contentId}>
                      <a
                        href="#"
                        className="cursor-pointer text-white hover:bg-gray-100 p-2 block"
                        onClick={() => {
                          scrollToContent(option.contentId);
                          setShowPopover(false);
                        }}>
                        {option.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
          <li className="-mt-3 mb-3">
            <a
              href="#"
              className="text-white hover:text-blue-200"
              onClick={openStatsModal}>
              Stats
            </a>
            <StatsModal show={showStatsModal} onClose={closeStatsModal} />
          </li>
          <li></li>
        </ul>
      </div>
    </div>
  );
}

export default TestNavbar;
