import AdminHome from "./home/AdminHome";
// import Login from "./login/Login";
import List from "./list/List";
import Single from "./single/Single";
import New from "./new/New";
import { Routes, Route } from "react-router-dom";
import { userInputs } from "../data/formSource";

const AdminPage = () => {

  return (
    <div className="app">
        <Routes>
            <Route index element={<AdminHome />} />
            <Route path="/users">
              <Route index element={<List List_Title="ADD NEW USERS"/>} />
              <Route path=":userId" element={<Single />} />
              <Route
                path="/users/new"
                element={<New inputs={userInputs} title="Add New User" />}
              />
            </Route>
            <Route path="/subscription">
              <Route index element={<List List_Title="Subscription"/>} />
              {/* <Route path=":userId" element={<Single />} /> */}
            </Route>
        </Routes>
    </div>
  );
}

export default AdminPage;