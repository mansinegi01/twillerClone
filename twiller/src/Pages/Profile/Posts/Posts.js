
import React, { useEffect } from "react";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";

const Posts = ({ p, notifyEnabled }) => {
  const { name, username, photo, video, post, profilephoto } = p;

  useEffect(() => {
    const keywords = ["cricket", "science"];
    const match = keywords.some((kw) => post?.toLowerCase().includes(kw));

    if (notifyEnabled && match && Notification.permission === "granted") {
      new Notification(`New tweet by @${username}`, {
        body: post,
        icon: profilephoto,
      });
    }
  }, [post, notifyEnabled, profilephoto, username]);

  return (
    <div className="post">
      <div className="post__avatar">
        <Avatar src={profilephoto} />
      </div>

      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {name}{" "}
              <span className="post__headerSpecial">
                <VerifiedUserIcon className="post__badge" />@{username}
              </span>
            </h3>
          </div>

          <div className="post__headerDescription">
            <p>{post}</p>
          </div>
        </div>

        {photo && <img src={photo} alt="post-img" width="500" style={{ marginTop: "10px" }} />}

        {video && (
          <video controls width="500" style={{ marginTop: "10px" }}>
            <source src={video} type="video/mp4" />
          </video>
        )}
        
        <div className="post__footer" style={{ marginTop: "10px" }}>
          <ChatBubbleOutlineIcon className="post__fotter__icon" fontSize="small" />
          <RepeatIcon className="post__fotter__icon" fontSize="small" />
          <FavoriteBorderIcon className="post__fotter__icon" fontSize="small" />
          <PublishIcon className="post__fotter__icon" fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default Posts;