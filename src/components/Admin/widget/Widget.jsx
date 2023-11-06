/* eslint-disable react/prop-types */
import "./widget.scss";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
// Impor komponen Widget

// Fungsi untuk mengambil jumlah pengguna
const fetchUserCount = async () => {
  const db = getFirestore();
  const usersCollection = collection(db, "users");
  const userSnapshot = await getDocs(usersCollection);
  return userSnapshot.size; // Jumlah pengguna
};

// Fungsi untuk mengambil jumlah berlangganan dengan status "success"
const fetchSubscriptionCount = async () => {
  const db = getFirestore();
  const paymentsCollection = collection(db, "payments");
  const subscriptionQuery = query(
    paymentsCollection,
    where("status", "==", "Success")
  );
  const subscriptionSnapshot = await getDocs(subscriptionQuery);
  return subscriptionSnapshot.size; // Jumlah berlangganan
};

const Widget = ({ type }) => {
  const [userCount, setUserCount] = useState(0);
  const [subscriptionCount, setSubscriptionCount] = useState(0);

  useEffect(() => {
    // Panggil fungsi untuk mengambil jumlah pengguna dan berlangganan
    fetchUserCount().then((count) => setUserCount(count));
    fetchSubscriptionCount().then((count) => setSubscriptionCount(count));
  }, []);

  let data;

  //temporary
  // const amount = 100;
  // const diff = 20;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
        amount: userCount,
      };
      break;
    case "subcription":
      data = {
        title: "SUBSCRIPTION",
        isMoney: false,
        link: "View all orders",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
        amount: subscriptionCount,
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "BALANCE",
        isMoney: true,
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.amount}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        {/* <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div> */}
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
