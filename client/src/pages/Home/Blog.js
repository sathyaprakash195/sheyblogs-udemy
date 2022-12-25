import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function Blog({ blog }) {
  const navigate = useNavigate();
  return (
    <div
      className="border shadow p-5 flex flex-col gap-3 cursor-pointer"
      onClick={() => {
        navigate(`/blog-desc/${blog._id}`);
      }}
    >
      <h1 className="text-primary text-xl font-bold">{blog.title}</h1>
      <hr />
      <p>{blog.description}</p>
      <hr />

      <div className="flex justify-between items-center">
        <div>
          <h1>Posted By: {blog.user.name}</h1>
          <h1>
            Posted On : {moment(blog.createdAt).fromNow()}
          </h1>
        </div>
        <div className="flex gap-5 items-center">
          <div className="flex gap-1 items-center">
            <i className="ri-heart-line"></i>
            <span>{blog.likesCount}</span>
          </div>
          <div className="flex gap-1 items-center">
            <i class="ri-chat-1-line"></i>
            <span>{blog.commentsCount}</span>
          </div>
          <div className="flex gap-1 items-center">
            <i class="ri-share-forward-line"></i>
            <span>{blog.sharesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
