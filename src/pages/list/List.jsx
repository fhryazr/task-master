/* eslint-disable react/prop-types */
import "./list.scss";
import Sidebar from "../../components/Admin/sidebar/Sidebar";
// import Navbar from "../../components/Admin/navbar/Navbar";
import Datatable from "../../components/Admin/datatable/Datatable";

const List = ({ List_Title }) => {
  return (
    <div className="list w-screen bg-white">
      <Sidebar />
      <div className="listContainer">
        {/* <Navbar /> */}
        <Datatable List_Title={List_Title} />
      </div>
    </div>
  );
};

export default List;
