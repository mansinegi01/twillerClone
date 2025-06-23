
import React, { useState } from "react";
import "./Tweetbox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import axios from "axios";

import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";

const Tweetbox = ({ onTweetSuccess }) => {
  const [post, setPost] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  const { user } = useUserAuth();
  const loggedInUser = useLoggedinuser();
  const email = user?.email;
  

  const userProfilePic = loggedInUser[0]?.profileImage || user?.photoURL;

  const handleImageUpload = (e) => {
    setIsLoadingImage(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=c3a0f8885589285826ac08cf6f88211e",
        formData
      )
      .then((res) => {
        setImageUrl(res.data.data.display_url);
      })
      .catch(console.error)
      .finally(() => setIsLoadingImage(false));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsLoadingVideo(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "upload_videos");
      data.append("cloud_name", "dbvtihfoh");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dbvtihfoh/video/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const uploadVideos = await response.json();
      setVideoUrl(uploadVideos.secure_url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingVideo(false);
    }
  };
const handleTweet = async (e) => {
  e.preventDefault();

  const name =
    loggedInUser[0]?.name || user?.displayName || "Anonymous";

  const username =
    loggedInUser[0]?.username || email?.split("@")[0];

  const tweetData = {
    name,
    username,
    email,
    profilephoto: userProfilePic,
    post,
    photo: imageUrl,
    video: videoUrl,
  };

  setPost("");
  setImageUrl("");
  setVideoUrl("");

  const res = await fetch("http://localhost:5000/post", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(tweetData),
  });

  if (onTweetSuccess) {
    onTweetSuccess();
  }

  const notifyEnabled = JSON.parse(localStorage.getItem("tweetNotifyEnabled"));
  const keywords = ["cricket", "science"];
  const match = keywords.some((kw) => post.toLowerCase().includes(kw));

  if (notifyEnabled && match) {
    if (Notification.permission === "granted") {
      new Notification(`New tweet by @${username}`, {
        body: post,
        icon: userProfilePic,
      });
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          new Notification(`New tweet by @${username}`, {
            body: post,
            icon: userProfilePic,
          });
        }
      });
    }
  }
};


  return (
    <div className="tweetBox">
      <form onSubmit={handleTweet}>
        <div className="tweetBox__input">
          <Avatar src={userProfilePic} />
          <input
            type="text"
            placeholder="What's happening?"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            required
          />
        </div>

        <div className="imageIcon_tweetButton">
          <label htmlFor="image" className="imageIcon">
            {isLoadingImage ? "Uploading Image..." : imageUrl ? "Image Uploaded" : <AddPhotoAlternateOutlinedIcon />}
          </label>
          <input
            type="file"
            id="image"
            className="imageInput"
            onChange={handleImageUpload}
            accept="image/*"
          />

          <label htmlFor="video" className="imageIcon">
            {isLoadingVideo ? "Uploading Video..." : videoUrl ? "Video Uploaded" : <VideoFileIcon />}
          </label>
          <input
            type="file"
            id="video"
            className="imageInput"
            onChange={handleVideoUpload}
            accept="video/*"
          />

          <Button type="submit" className="tweetBox__tweetButton">
            Tweet
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Tweetbox;
