import "./single.scss";
import Sidebar from "../../components/Admin/sidebar/Sidebar";
import Chart from "../../components/Admin/chart/Chart";
import List from "../../components/Admin/table/Table";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { getAllFocusTimeInInterval } from "../../utils/statsUtils";

const Single = () => {
  const { userId } = useParams();
  const [data, setUserData] = useState({});
  const [focusStats, setFocusStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        setUserData(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    fetchData();
  }, [userId]);

  const getFocusStats = useCallback(async () => {
    try {
      // const userId = user.uid;
      const userRef = doc(db, "users", userId);
      const focusStatsRef = collection(userRef, "focusStats");
      const focusStatsSnapshot = await getDocs(focusStatsRef);

      if (!focusStatsSnapshot.empty) {
        const focusStats = [];
        focusStatsSnapshot.forEach((doc) => {
          focusStats.push(doc.data());
        });
        const mergedFocusStats = [].concat(...focusStats);

        setFocusStats(mergedFocusStats[0].data);
      }
    } catch (error) {
      console.error("Error fetching focus stats: ", error);
    }
  }, [userId]);

  useEffect(() => {
    getFocusStats();
  }, [getFocusStats, userId]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    // Tambahkan logika pemformatan
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const dataRaw = getAllFocusTimeInInterval(focusStats);

  return (
    <div className="single w-screen bg-white">
      <Sidebar />
      <div className="singleContainer">
        {/* <Navbar /> */}
        <div className="top">
          <div className="left">
            {/* <div className="editButton">Edit</div> */}
            <h1 className="title">Information</h1>
            <div className="item flex flex-col">
              <img src={data.img} alt="" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle text-lg">{data.displayName}</h1>
                <div className="detailItem">
                  <span className="itemKey">Username :</span>
                  <span className="itemValue">{data.username}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email :</span>
                  <span className="itemValue">{data.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Roles :</span>
                  <span className="itemValue">{data.roles}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Status :</span>
                  <span className="itemValue">{data.status}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            {focusStats.length > 0 ? (
              <>
                <Chart
                  // key={index}
                  title={"User Focus Statistics"} // Gantilah dengan properti yang sesuai dari data statistik
                  aspect={3 / 1} // Gantilah dengan properti yang sesuai dari data statistik
                  data={dataRaw} // Gantilah dengan properti yang sesuai dari data statistik
                  formatTime={formatTime} // Pastikan Anda memiliki fungsi formatTime yang sesuai
                />
              </>
            ) : (
              <div className="bg-white h-full flex justify-center items-center shadow-xl">
                <h1>No focus statistics available.</h1>
              </div>
            )}
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default Single;
