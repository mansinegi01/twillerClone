
import React, { useRef } from "react";
import { getAuth, signOut } from "firebase/auth";

const VideoFunctions = ({ src, onNextVideo, onShowComments }) => {
  const videoRef = useRef();
  const tapCountRef = useRef(0);
  const timeoutRef = useRef(null);


const tryToCloseWindow = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Could not log out. Please try again.");
  }
};


  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    const side =
      x < width / 3 ? "left" : x > (2 * width) / 3 ? "right" : "center";

    tapCountRef.current += 1;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const count = tapCountRef.current;

      if (count === 1) {
        if (side === "center") togglePlayPause();
      } else if (count === 2) {
        if (side === "left") seek(-10);
        else if (side === "right") seek(10);
      } else if (count === 3) {
        if (side === "center") onNextVideo?.();
        else if (side === "left") onShowComments?.();
        else if (side === "right") tryToCloseWindow();
      }

      tapCountRef.current = 0;
    }, 300);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  const seek = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(
      0,
      Math.min(video.duration, video.currentTime + seconds)
    );
  };

  return (
    <div
      onClick={handleTap}
      style={{
        margin: "0 0 0 90px",
        width: "fit-content",
        display: "inline-block",
        touchAction: "manipulation",
      }}
    >
      <video
        ref={videoRef}
        src={src}
        width="500"
        controls
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        style={{
          border: "1px solid white",
          borderRadius: "10px",
          userSelect: "none",
        }}
      />
    </div>
  );
};

export default VideoFunctions;