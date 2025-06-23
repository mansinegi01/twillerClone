
import React, { useState, useEffect } from "react";
import Post from "../Posts/Posts";
import { useNavigate } from "react-router-dom";
import "./Mainprofile.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";

import Editprofile from "../Editprofile/Editprofile";

import axios from "axios";

import useLoggedinuser from "../../../hooks/useLoggedinuser";

const Mainprofile = ({ user }) => {
  const navigate = useNavigate();

  const [isloading, setisloading] = useState(false);
  const [loggedinuser] = useLoggedinuser();
  const username = user?.email?.split("@")[0];
  const [post, setpost] = useState([]);

  const [notifyEnabled, setNotifyEnabled] = useState(
    JSON.parse(localStorage.getItem("tweetNotifyEnabled")) ||
      false
  );

  const requestNotificationPermission = async () => {
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  };

 const handleToggle = () => {
  const newValue = !notifyEnabled;
  setNotifyEnabled(newValue);
  localStorage.setItem("tweetNotifyEnabled", JSON.stringify(newValue));

  if (newValue && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
};

  useEffect(() => {
    fetch(`http://localhost:5000/userpost?email=${user?.email}`)
      .then((res) => res.json()) 
      .then((data) => {
        setpost(data);
      });
  }, [user?.email]);

  const handleuploadcoverimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=c3a0f8885589285826ac08cf6f88211e",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        setisloading(false);
        if (url) {
          fetch(`http://localhost:5000/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ coverimage: url })
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setisloading(false);
      });
  };

  const handleuploadprofileimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=c3a0f8885589285826ac08cf6f88211e",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        setisloading(false);
        if (url) {
          fetch(`http://localhost:5000/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ profileImage: url })
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setisloading(false);
      });
  };

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>
      <div className="mainprofile">
        <div className="profile-bio">
          <div>
            <div className="coverImageContainer">
              <img
                src={loggedinuser[0]?.coverimage || user?.photoURL}
                alt=""
                className="coverImage"
              />
              <div className="hoverCoverImage">
                <label htmlFor="image" className="imageIcon">
                    {isloading ? (
                    <LockResetIcon className="photoIcon photoIconDisabled" />
                    ) : (
                    <CenterFocusWeakIcon className="photoIcon" />
                    )}

                </label>
                <input
                    type="file"
                    id="image"
                    className="imageInput"
                    onChange={handleuploadcoverimage}
                />
              </div>
            </div>

            <div className="avatar-img">
              <div className="avatarContainer">
                <img
                    src={loggedinuser[0]?.profileImage ||
                         user?.photoURL}
                    alt=""
                    className="avatar"
                />
                <div className="hoverAvatarImage">
                    <label htmlFor="profileImage" className="imageIcon">
                    {isloading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled" />
                        ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                        )}

                    </label>
                    <input
                        type="file"
                        id="profileImage"
                        className="imageInput"
                        onChange={handleuploadprofileimage}
                    />
                </div>
              </div>

              <div className="userInfo">
                <h3 className="heading-3">
                    {loggedinuser[0]?.name ||
                    user?.displayName}
                </h3>
                <p className="usernameSection">@{username}</p>
                <Editprofile user={user} loggedinuser={loggedinuser} />
              </div>

              <div className="infoContainer">
                {loggedinuser[0]?.bio && <p>{loggedinuser[0]?.bio}</p>}

                <div className="locationAndLink">
                    {loggedinuser[0]?.location && (
                    <p className="suvInfo">
                        <MyLocationIcon /> {loggedinuser[0]?.location}
                    </p>
                    )}

                    {loggedinuser[0]?.website && (
                    <p className="subInfo link">
                        <AddLinkIcon /> {loggedinuser[0]?.website}
                    </p>
                    )}

                </div>

                <div className="notification-toggle">
                    <label>
                    <input
                        type="checkbox"
                        checked={notifyEnabled}
                        onChange={handleToggle}
                    />
                    Enable notifications for "cricket" and "science"
                    </label>
                </div>

              </div>

              <h4 className="tweetsText">Tweets</h4>
              <hr />

            </div>

            {post.map((p) => (
              <Post key={p._id} p={p} />
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainprofile;

