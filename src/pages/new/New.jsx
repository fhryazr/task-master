/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "./new.scss";
import Sidebar from "../../components/Admin/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { setDoc, doc, getDoc,updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../config/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const New = ({ inputs, title, mode }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({ img: "https://firebasestorage.googleapis.com/v0/b/emailpasswordlogin-c8b96.appspot.com/o/No_Profile_Picture.jpg?alt=media&token=b681ea5f-f0d6-4c86-9362-ad54b968af2d"});
  const [perc, setPerc] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const { userId } = useParams();

  const getUser = useCallback(async () => {
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists) {
      const getDataUser = userSnapshot.data();
      setUserData(getDataUser);
    } else {
      console.log("error");
    }
  }, [userId]);

  useEffect(() => {
    if (mode === "edit") {
      getUser();
    }
  }, [userId, mode, getUser]);

  // console.log(userData)

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      // console.log(name)
      const storageRef = ref(storage, file.name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleAdd = async (e) => {
    e.preventDefault(); // Ensure 'e' is properly passed and not undefined
    if (mode === "edit") {
      const userDoc = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDoc);

      let img
      if (!file) {
        img = userSnapshot.data().img;
      } else {
        img = data.img
      }
  
      if (userSnapshot.exists) {
        // Ambil data yang ingin diubah
        const dataToUpdate = {
          displayName: data.displayName || userSnapshot.data().displayName,
          username: data.username || userSnapshot.data().username,
          email: data.email || userSnapshot.data().email,
          roles: data.roles || userSnapshot.data().roles,
          status: data.status || userSnapshot.data().status,
          img: img,
        };
  
        try {
          await updateDoc(userDoc, dataToUpdate);
          navigate(-1);
          console.log("Document updated successfully");
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      } else {
        console.log("User document not found");
      }
    } else {
      try {
        const res = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        await setDoc(doc(db, "users", res.user.uid), {
          ...data,
          createdAt: new Date(),
        });
        navigate(-1);
        console.log("Document written with ID: ", res.user);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // console.log(data);
  // console.log(inputs);

  return (
    <div className="new w-screen bg-white">
      <Sidebar />
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom flex flex-col">
          <div className="h-[5rem] w-[5rem] mb-3">
            <img
              className="h-[5rem] w-[5rem] object-cover rounded-full"
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div>
            <form onSubmit={handleAdd}>
              <div className="mb-2">
                <label htmlFor="file">
                  Image:{" "}
                  <DriveFolderUploadOutlinedIcon className="icon cursor-pointer" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                {inputs.map((input) => (
                  <div key={input.id}>
                    <div className="">
                      <label>{input.label}</label>
                    </div>
                    <input
                      className="p-2 mb-2"
                      id={input.id}
                      type={input.type}
                      placeholder={input.placeholder}
                      onChange={handleInput}
                      defaultValue={input.value}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-green-600 mt-2 text-white px-7 py-2 rounded-md"
                  disabled={perc !== null && perc < 100}
                  onClick={handleAdd}>
                  Send
                </button>
                <button
                  className="bg-red-600 mt-2 text-white px-4 py-2 rounded-md"
                  disabled={perc !== null && perc < 100}
                  onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
