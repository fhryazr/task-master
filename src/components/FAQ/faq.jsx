import Faq from "react-faq-component";
import "./faq.css";
import { useEffect, useRef, useState } from "react";

const data = {
  title: "FAQ",
  rows: [
    {
      title: "What is Pomodoro?",
      content: `The Pomodoro Technique is created by Francesco Cirillo for a more productive way to work and study. The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a pomodoro, from the Italian word for 'tomato', after the tomato-shaped kitchen timer that Cirillo used as a university student`,
    },
    {
      title: "Nunc maximus, magna at ultricies elementum",
      content:
        "Nunc maximus, magna at ultricies elementum, risus turpis vulputate quam, vitae convallis ex tortor sed dolor.",
    },
    {
      title: "Curabitur laoreet, mauris vel blandit fringilla",
      content: `Curabitur laoreet, mauris vel blandit fringilla, leo elit rhoncus nunc, ac sagittis leo elit vel lorem.
            Fusce tempor lacus ut libero posuere viverra. Nunc velit dolor, tincidunt at varius vel, laoreet vel quam.
            Sed dolor urna, lobortis in arcu auctor, tincidunt mattis ante. Vivamus venenatis ultricies nibh in volutpat.
            Cras eu metus quis leo vestibulum feugiat nec sagittis lacus.Mauris vulputate arcu sed massa euismod dignissim. `,
    },
  ],
};

const styles = {
  bgColor: "transparent",
  titleTextColor: "black",
  rowTitleColor: "black",
  rowContentColor: "black",
  titleTextSize: "20px",
  // rowTitleSize: "16px",
  arrowColor: "black",
};

const config = {
  animate: true,
  arrowIcon: "V",
  openOnload: 0,
  expandIcon: "+",
  collapseIcon: "-",
};

export default function App() {
  const faqRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Callback yang akan dipanggil ketika elemen FAQ terlihat di layar
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Jika elemen terlihat, set state isVisible menjadi true
        setIsVisible(true);
      } else {
        // Jika elemen tidak terlihat, set state isVisible menjadi false
        setIsVisible(false);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null, // Gunakan viewport sebagai root
      rootMargin: "0px", // Tidak ada margin tambahan
      threshold: 0.5, // Ketika 50% elemen terlihat di layar
    });

    if (faqRef.current) {
      // Awali observasi pada elemen FAQ
      observer.observe(faqRef.current);
    }

    // Bersihkan observasi saat komponen di-unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`faq display inline-block overflow-y-auto p-4 text-sm w-[90vw] sm:w-[70vw] lg:w-[50vw]  ${
        isVisible ? "fade-in" : ""
      }`}
      ref={faqRef}
    >
      <Faq data={data} styles={styles} config={config} />
    </div>
  );
}
