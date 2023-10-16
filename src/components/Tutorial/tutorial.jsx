import { useEffect, useRef, useState } from "react";

const AboutUs = () => {
  const aboutUsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const aboutUsElement = aboutUsRef.current;
    const handleScroll = () => {
      const elementPosition = aboutUsElement.getBoundingClientRect().top;

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
      className={`about-us w-[95vw] sm:w-[70vw] lg:w-[50vw] p-4 display inline-block ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } transition-opacity duration-1000 ease-in-out transform`}
    >
      <h2 className="text-white font-semibold border-b-2 border-gray-300 pb-2 text-xl lg:text-lg">
        How to use TaskMaster?
      </h2>
      <ol className="list-decimal pl-5 mt-5 text-white">
        <li style={{ marginTop: "10px" }}>Menambahkan tugas.</li>
        <li style={{ marginTop: "10px" }}>Start Timer</li>
        <li style={{ marginTop: "10px" }}>Masuk ke dashboard utama.</li>
        <li style={{ marginTop: "10px" }}>
          Mulai dengan menambahkan tugas baru.
        </li>
        <li style={{ marginTop: "10px" }}>
          Putar Background Musik Yang Kamu Inginkan.
        </li>
      </ol>
    </div>
  );
};

export default AboutUs;
