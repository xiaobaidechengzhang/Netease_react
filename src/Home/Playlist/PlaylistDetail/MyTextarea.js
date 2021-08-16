import React, { useState, useEffect } from "react";

export default function MyTextarea(props) {
  const [commentVal, setCommentVal] = useState("");

  const commentValChange = (event) => {
    let val = event.target.value;
    setCommentVal(val);
    // props.onChange(event);
  };
  const headerComment = () => {
    props.comment(commentVal)
    setCommentVal('')
  }
  return (
    <div className="comment-header">
      <div className="comment-header-textarea">
        <textarea
          rows="10"
          className="comment-textarea"
          maxLength="140"
          value={commentVal}
          onChange={commentValChange}
        />
        <span className="comment-surplus-length">
          {140 - commentVal.length}
        </span>
      </div>
      <div className="comment-header-bottom">
        <p>9999</p>
        <button className="bottom-right-btn" onClick={headerComment}>
          评论
        </button>
      </div>
    </div>
  );
}
