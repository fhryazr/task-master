import { useEffect, useRef, useState } from "react";

const AboutUs = () => {
  const aboutUsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const aboutUsElement = aboutUsRef.current;
    const handleScroll = () => {
      const elementPosition = aboutUsElement.getBoundingClientRect().top;

      // Tambahkan pengecekan jika elemen berada dalam viewport
      if (elementPosition <= window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={aboutUsRef}
      className={`about-us display inline-block mx-20 mt-20 ms-20 me-20 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } transition-opacity duration-1000 ease-in-out transform`}
    >
      <h2 className="text-white font-semibold border-b-2 border-gray-300 pb-2 text-[27px]">
        What is TaskMaster?
      </h2>
      <p className="display block mt-5 text-white">
        TaskMaster is an innovative task and time management platform that helps
        individuals and teams organize tasks efficiently. It is a web-based
        solution with task management, Pomodoro technique integration, and
        monitoring of productivity statistics. TaskMaster aims to improve user
        productivity and performance in work and daily activities.
      </p>
    </div>
  );
};

export default AboutUs;