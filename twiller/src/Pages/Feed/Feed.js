
import React, { useEffect, useRef, useState } from "react";
import "./Feed.css";
import Posts from "./Posts/Posts";
import Tweetbox from "./Tweetbox/Tweetbox";
import VideoFunctions from "../Profile/Posts/VideoFunctions";
import { useNavigate } from "react-router-dom";
import useLoggedinuser from "../../hooks/useLoggedinuser";

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [videoPosts, setVideoPosts] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRefs = useRef({});
  const navigate = useNavigate();

  const [user] = useLoggedinuser();

  const fetchPosts = () => {
    fetch("http://localhost:5000/post")
      .then((res) => res.json())
      .then((data) => {
        setAllPosts(data);
        setVideoPosts(data.filter((p) => p.video));
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNextVideo = () => {
    if (videoIndex + 1 < videoPosts.length) {
      const nextIndex = videoIndex + 1;
      setVideoIndex(nextIndex);
      const nextId = videoPosts[nextIndex]._id;
      setTimeout(() => {
        videoRefs.current[nextId]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    } else {
      alert("No next videos available");
    }
  };

  const handleShowComments = (postId) => {
    navigate(`/comments/${postId}`, {
      state: {
        name: user?.name || "Guest",
        email: user?.email || "guest@example.com",
      },
    });
  };

  const notifyEnabled = JSON.parse(localStorage.getItem("tweetNotifyEnabled"));

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>

      <Tweetbox onTweetSuccess={fetchPosts} />

      {allPosts.map((p) => {
        const isActiveVideo = videoPosts[videoIndex]?._id === p._id;

        return (
          <div key={p._id} ref={(el) => (videoRefs.current[p._id] = el)}>
            <Posts p={p} notifyEnabled={notifyEnabled} />

            {p.video &&
              (isActiveVideo ? (
                <VideoFunctions
                  src={p.video}
                  onNextVideo={handleNextVideo}
                  onShowComments={() => handleShowComments(p._id)}
                  onCloseSite={() => {
                    console.log("Closing window...");
                    window.close();
                  }}
                />
              ) : (
                <div style={{ margin: "0 0 0 90px" }}>
                  <video
                    src={p.video}
                    width="500"
                    controls
                    style={{ border: "1px solid white", borderRadius: "10px" }}
                  />
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
