import { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";
// import { AuthContext } from "../../context/AuthContext"; // Import your AuthContext
// import { db } from "../../config/FirebaseConfig"; // Import your Firebase config
// import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
import ProfilePopup from "./profil";

function Navbar() {
  const [showPopover, setShowPopover] = useState(false);
  const referenceElement = useRef(null);
  const popoverElement = useRef(null);

  // Access the user data from your AuthContext
  // const { currentUser } = useContext(AuthContext);

  // const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    <nav className="bg-white-500 py-2 w-full">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-white text-xl font-semibold">Task Master</div>
          <ul className="flex items-center space-x-4">
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
              <a href="" className="text-white hover:text-blue-200">
                Stats
              </a>
            </li>
            <li>
              {isLoggedIn ? (
                <a
                  className="text-white hover:text-blue-200"
                  onClick={() => {
                    setShowProfile(true); // Menampilkan pop-up profil
                  }}
                ></a>
              ) : (
                <a href="login" className="text-white hover:text-blue-200">
                  Login
                </a>
              )}
              <ProfilePopup
                showProfile={showProfile}
                setShowProfile={setShowProfile}
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
