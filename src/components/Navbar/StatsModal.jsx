/* eslint-disable react/prop-types */
import { useRef, useEffect, useState, useCallback } from "react";
import Chart from "../Admin/chart/Chart";
import {
  calculateTotalFocusTime,
  formatTime,
  getFocusTimeInInterval,
  getFocusTimeInWeekInterval,
  getFocusTimeInMonthInterval,
  getFocusTimeInYearInterval,
} from "../../utils/statsUtils";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { db } from "../../config/FirebaseConfig";
import { getDocs, doc, collection } from "firebase/firestore";

const StatsModal = ({ show, onClose }) => {
  const modalRef = useRef(null);
  const [dataFocus, setDataFocus] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const user = currentUser;

  const getFocusStats = useCallback(async() => {
    if (user !== null) {
      const userId = user.uid;
      try {
        const userId = user.uid;
        const userRef = doc(db, "users", userId);
        const focusStatsRef = collection(userRef, "focusStats");
        const focusStatsSnapshot = await getDocs(focusStatsRef);

        if (!focusStatsSnapshot.empty) {
          const focusStats = [];
          focusStatsSnapshot.forEach((doc) => {
            focusStats.push(doc.data());
          });
          // Merge the focusStats array
          const mergedFocusStats = [].concat(...focusStats);
          
          mergedFocusStats.map((focusStats) => 
          Cookies.set(`stats-${userId}`, JSON.stringify(focusStats.data),  {
            expires: 365,
            }));
        }
      } catch (error) {
        console.error("Error fetching focus stats: ", error);
      }
      // const focusStatsRaw = localStorage.getItem("focusTimeStorage");
      const focusStatsRaw = Cookies.get(`stats-${userId}`);
      if (focusStatsRaw) {
        const focusStats = JSON.parse(focusStatsRaw);
        setDataFocus(focusStats);
      } else {
        return null;
      }
    }
  }, [user]);

  useEffect(() => {
    if (show) {
      modalRef.current.showModal();
      if (user) {
        getFocusStats(); // Menampilkan modal
      }
    } else {
      modalRef.current.close(); // Menutup modal
    }
  }, [show, user, getFocusStats]);

  const date = new Date();
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  

  const totalFocusTime = calculateTotalFocusTime(dataFocus);
  const oneDayTotalFocusTime = getFocusTimeInInterval(dataFocus, 0);

  const focusStatsInWeekInterval = getFocusTimeInWeekInterval(dataFocus);
  focusStatsInWeekInterval.sort((a, b) => new Date(a.name) - new Date(b.name));

  const focusStatsInMonthInterval = getFocusTimeInMonthInterval(dataFocus);
  focusStatsInMonthInterval.sort((a, b) => new Date(a.name) - new Date(b.name));

  const focusStatsInYearInterval = getFocusTimeInYearInterval(dataFocus);
  focusStatsInYearInterval.sort((a, b) => new Date(a.name) - new Date(b.name));

  // console.log(typeof dataFocus)

  //parameter untuk charts
  const intervalData = [
    {
      title: "Today",
      aspect: 2 / 1,
      data: [
        { name: '', Total: 0 },
        { name: formattedDate, Total: oneDayTotalFocusTime },
      ],
    },
    {
      title: "This Week",
      aspect: 2 / 1,
      data: focusStatsInWeekInterval,
    },
    {
      title: "This Month",
      aspect: 2 / 1,
      data: focusStatsInMonthInterval,
    },
    {
      title: "This Year",
      aspect: 2 / 1,
      data: focusStatsInYearInterval,
    },
  ];

  return (
    <dialog
      id="my_modal_2"
      className="modal bg-black bg-opacity-20 flex justify-center items-center"
      ref={modalRef}>
      <div className="bg-white rounded-lg z-10 p-1">
        <div className="ms-auto me-auto modal-box h-[50vh] w-[90vw] md:w-[60vw] md:h-[75vh] lg:w-[40vw] xl:w-[30vw] shadow-none">
          <div className="text-center">
            {user ? (
              <>
                <h1 className="font-bold text-xl mb-2">
                  Focus Time Statistics
                </h1>
                <strong>Lifetime Spend Focus Time : </strong>
                <p>{formatTime(totalFocusTime)}</p>
                {dataFocus.length > 0 ? (
                  <>
                    <p className="py-4">Congrats Keep Your Focus Progress</p>
                    {intervalData.map((interval, index) => (
                      <div key={index} className="mb-5">
                        <Chart
                          key={index}
                          title={interval.title}
                          aspect={interval.aspect}
                          data={interval.data}
                          formatTime={formatTime}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center h-[30vh] md:h-[50vh]">
                      <p className="py-4 text-xl font-semibold">Begin Your Focus Session to Track Time</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center h-[40vh] md:h-[65vh]">
                  <h1 className="text-xl mb-4">
                    Log In to Track and Analyze Your Focus Time
                  </h1>
                  <Link to="/login">
                    <span className="text-lg bg-purple-900 text-white px-5 py-2 rounded-md">
                      Login
                    </span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <form
        method="dialog"
        className="modal-backdrop absolute h-screen w-screen z-0"
        onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default StatsModal;
