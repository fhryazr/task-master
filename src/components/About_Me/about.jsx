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
      className={`about-us p-4 w-[95vw] sm:w-[70vw] lg:w-[50vw] display inline-block ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } transition-opacity duration-1000 ease-in-out transform`}
    >
      <h2 className="text-black font-semibold border-b-2 border-gray-300 pb-2 text-xl lg:text-lg">
        What is TaskMaster?
      </h2>
      <p className="display block mt-5 text-black">
        TaskMaster is an innovative task and time management platform that helps
        individuals and teams organize tasks efficiently. It is a web-based
        solution with task management, Pomodoro technique integration, and
        monitoring of productivity statistics. TaskMaster aims to improve user
        productivity and performance in work and daily activities.
        TaskMaster is not just your ordinary task and time management platform
        it&apos;s a productivity powerhouse! Whether you&apos;re a solo worker
        looking to streamline your day or part of a dynamic team, TaskMaster has
        your back. This web-based solution is your gateway to enhanced task
        management, seamlessly integrated with the Pomodoro technique.
        What&apos;s more? It keeps a watchful eye on your productivity
        statistics.
      </p>
      <p className="display block mt-5 text-black">
        Say goodbye to those chaotic to-do lists and disorganized schedules.
        TaskMaster is here to transform the way you work and live. Our mission
        is crystal clear: to empower you to be at your best. We believe that
        productivity isn&apos;t just about ticking off tasks; it&apos;s about
        achieving your goals, realizing your dreams, and unlocking your true
        potential.
      </p>
      <p className="display block mt-5 text-black">
        With TaskMaster, you&apos;re not just managing time; you&apos;re
        mastering it. Join us on this journey to boost your efficiency, own your
        schedule, and supercharge your success. It&apos;s time to unleash your
        inner TaskMaster!
      </p>
    </div>
  );
};

export default AboutUs;
