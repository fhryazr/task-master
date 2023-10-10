import { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";

function Navbar() {
  const [showPopover, setShowPopover] = useState(false);
  const referenceElement = useRef(null);
  const popoverElement = useRef(null);

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
          <div className="text-white text-xl font-semibold">My Website</div>
          <ul className="flex space-x-4">
            <li>
              <a
                href="#"
                className="text-white hover:text-blue-200"
                onClick={handlePopoverClick}
                ref={referenceElement}
              >
                Info
              </a>
              {showPopover && (
                <div
                  className="bg-white border border-gray-300 p-4 rounded-lg shadow-md"
                  ref={popoverElement}
                >
                  <ul>
                    {options.map((option) => (
                      <li key={option}>
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
              <a href="#services" className="text-white hover:text-blue-200">
                Settings
              </a>
            </li>
            <li>
              <a href="login" className="text-white hover:text-blue-200">
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
