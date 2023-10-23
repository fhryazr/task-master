import "./single.scss";
import Sidebar from "../../components/Admin/sidebar/Sidebar";
// import Navbar from "../../components/Admin/navbar/Navbar";
import Chart from "../../components/Admin/chart/Chart";
import List from "../../components/Admin/table/Table";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

const Single = () => {
  const { userId } = useParams();
  const [data, setUserData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        setUserData(docSnap.data())
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    fetchData()
  }, [userId]);

  // console.log(data)

  return (
    <div className="single w-screen bg-white">
      <Sidebar />
      <div className="singleContainer">
        {/* <Navbar /> */}
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src={data.img}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{data.displayName}</h1>
                <div className="detailItem">
                  <span className="itemKey">username:</span>
                  <span className="itemValue">{data.username}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">email:</span>
                  <span className="itemValue">{data.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Roles</span>
                  <span className="itemValue">{data.roles}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Status:</span>
                  <span className="itemValue">Free</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
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
