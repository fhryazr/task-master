/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../../data/datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";

const Datatable = ({ List_Title }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fecth Realtime
    const unsub = onSnapshot(collection(db, "users"), (snapShot) => {
      let list = [];
      try {
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      } catch (err) {
        console.log(err);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      // Hapus data dari Firestore
      await deleteDoc(doc(db, "users", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const userId = params.row.id;
        return (
          <div className="cellAction">
            <Link to={`detail/${userId}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <Link to={`edit/${userId}`} style={{ textDecoration: "none" }}>
              <div className="editButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}>
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle px-2">
        {List_Title}
        <Link to="new" className="link">
          Add New
        </Link>
      </div>
      <div>
        <DataGrid
          className="datagrid"
          rows={data}
          columns={userColumns.concat(actionColumn)}
          pageSize={1}
          rowsPerPageOptions={[1]}
          checkboxSelection
          getRowClassName={(params) =>
            params.index % 2 === 0 ? "even:bg-white" : "odd:bg-gray-100"
          }
        />
      </div>
    </div>
  );
};

export default Datatable;
