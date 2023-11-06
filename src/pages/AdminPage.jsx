import AdminHome from "./home/AdminHome";
// import Login from "./login/Login";
import List from "./list/List";
import Single from "./single/Single";
import New from "./new/New";
import { Routes, Route } from "react-router-dom";
import { userInputs } from "../data/formSource";
import Pro from "./pro/Pro";
import Edit from "./Edit";

const AdminPage = () => {

  return (
    <div className="app">
        <Routes>
            <Route index element={<AdminHome />} />
            <Route path="/users">
              <Route index element={<List List_Title="ADD NEW USERS"/>} />
              <Route path="/users/detail/:userId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={userInputs} title="Add New User" />}
              />
              <Route
                path="/users/edit/:userId"
                element={<Edit/>}
              />
            </Route>
            <Route path="/subscription">
              <Route index element={<Pro/>} />
              {/* <Route path=":userId" element={<Single />} /> */}
            </Route>
        </Routes>
    </div>
  );
}

export default AdminPage;