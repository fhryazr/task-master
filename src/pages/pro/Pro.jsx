import Sidebar from "../../components/Admin/sidebar/Sidebar";
import SubList from "../../components/Admin/table/Table";
import "../list/list.scss";
const Pro = () => {
  return (
    <div className="list flex w-screen">
      <Sidebar />
      <div className="listContainer h-screen bg-white">
        <div className="subsContainer">
          <h1 className="title">Subscription</h1>
          <SubList />
        </div>
      </div>
    </div>
  );
};

export default Pro;
