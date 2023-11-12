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

function Navbar() {
  const [showPopover, setShowPopover] = useState(false);
  const referenceElement = useRef(null);
  const popoverElement = useRef(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const { currentUser, dispatch } = useContext(AuthContext);
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

  const handleLogout = async () => {
    const auth = getAuth();
    auth.signOut();
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("Pembayaran")
    setIsPremium(false);
  }

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
    <nav className={`py-2 w-full`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-white text-xl font-semibold md:hidden">TM</div>
          <div className="text-white text-xl font-semibold hidden md:block">
            Task Master
          </div>
          <ul className="flex items-center space-x-4">
            <li>{isPremium ? <Premium /> : <Subscription />}</li>
            <li>
              <BackgroundColorChanger />
            </li>
            <li>
              <a
                href="#"
                className="text-white hover:text-blue-200"
                onClick={handlePopoverClick}
                ref={referenceElement}
              >
                About
              </a>
              {showPopover && (
                <div
                  className="bg-white border border-gray-300 p-4 rounded-lg shadow-md"
                  ref={popoverElement}
                >
                  <ul>
                    {options.map((option) => (
                      <li key={option.contentId}>
                        <a
                          href="#"
                          className="cursor-pointer hover:bg-gray-100 p-2 block"
                          onClick={() => {
                            scrollToContent(option.contentId);
                            setShowPopover(false);
                          }}
                        >
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
                onClick={openStatsModal}
              >
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
                  }}
                >
                  <ProfilePopup
                    showProfile={showProfile}
                    setShowProfile={setShowProfile}
                    logOut={handleLogout}
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
    </nav>
  );
}

export default Navbar;
