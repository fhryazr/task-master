import Sidebar from "../../components/Admin/sidebar/Sidebar";
import "./adminhome.scss";
import Widget from "../../components/Admin/widget/Widget";
import Featured from "../../components/Admin/featured/Featured";
import Chart from "../../components/Admin/chart/Chart";
import Table from "../../components/Admin/table/Table";

const AdminHome = () => {
  return (
    <div className="home w-screen">
      <Sidebar />
      <div className="homeContainer">
        <div className="widgets">
          <Widget type="user" />
          <Widget type="subcription" />
          <Widget type="earning" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;