import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Comments.css";

const Comments = () => {
  const { postId } = useParams();
  const { state } = useLocation();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const user = {
    name: state?.name || "Unknown",
    email: state?.email || "unknown@gmail.com",
  };

  useEffect(() => {
    fetch(`http://localhost:5000/comments/${postId}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [postId]);

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    const newComment = {
      postId,
      name: user.name,
      email: user.email,
      text: commentText,
    };

    fetch("http://localhost:5000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    })
      .then((res) => res.json())
      .then(() => {
        setComments((prev) => [{ ...newComment, timestamp: new Date() }, ...prev]);
        setCommentText("");
      });
  };

  return (
    <div className="comments-page">
      <h2>Comments</h2>
      <div className="comment-input">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleSubmit}>Post</button>
      </div>
      <div className="comment-list">
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} className="comment-item">
              <strong>{c.name}</strong>: {c.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
