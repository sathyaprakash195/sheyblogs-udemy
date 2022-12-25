import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { DeleteBlog, GetBlogById } from "../../apicalls/blogs";
import ReactHtmlParser from "react-html-parser";
import draftToHtml from "draftjs-to-html";
import moment from "moment";
import {
  AddComment,
  GetAllCommentsOfBlog,
  GetAllLikesOfBlog,
  LikeBlog,
  UnlikeBlog,
} from "../../apicalls/blogActions";
import Comment from "./Comment";
import Share from "./Share";

function BlogDescription() {
  const [comments = [], setComments = []] = useState([]);
  const [showComments = false, setShowComments = false] = useState(true);

  const [showShare = false, setShowShare = false] = useState(false);
  const [showAddComment = false, setShowAddComment = false] = useState(false);
  const [comment = "", setComment = ""] = useState("");
  const [isAlreadyLiked, setIsAlreadyLiked] = useState(false);
  const [likes = [], setLikes = []] = useState([]);
  const [blog, setBlog] = useState(null);
  const { currentUser, socket } = useSelector((state) => state.usersReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const deletBlog = async () => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteBlog(id);
      if (response.success) {
        toast.success(response.message);
        navigate("/");
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetBlogById(id);
      const likesResponse = await GetAllLikesOfBlog(id);
      const commentsResponse = await GetAllCommentsOfBlog(id);
      if (likesResponse.success) {
        setLikes(likesResponse.data);
        const isLiked = likesResponse.data.find(
          (like) => like.user._id === currentUser._id
        );
        setIsAlreadyLiked(isLiked);
      }
      if (commentsResponse.success) {
        setComments(commentsResponse.data);
      }

      if (response.success) {
        setBlog(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const likeOrUnlike = async () => {
    try {
      dispatch(ShowLoading());
      let response = null;

      if (isAlreadyLiked) {
        socket.emit("newNotification", {
          userId: blog?.user?._id,
          title: `${currentUser?.name} unliked your blog ${blog?.title}`,
        });

        response = await UnlikeBlog({
          blog: blog?._id,
          user: currentUser._id,
          notificationPayload: {
            user: blog?.user?._id,
            title: `${currentUser?.name} unliked your blog ${blog?.title}`,
            onClick: `/blog-desc/${blog?._id}`,
          },
        });
      } else {
        socket.emit("newNotification", {
          userId: blog?.user?._id,
          title: `${currentUser?.name} liked your blog ${blog?.title}`,
        });

        response = await LikeBlog({
          blog: blog?._id,
          user: currentUser._id,
          notificationPayload: {
            user: blog?.user?._id,
            title: `${currentUser?.name} liked your blog ${blog?.title}`,
            onClick: `/blog-desc/${blog?._id}`,
          },
        });
      }
      if (response.success) {
        getData();
        setIsAlreadyLiked(!isAlreadyLiked);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const addComment = async () => {
    try {
      dispatch(ShowLoading());
      const response = await AddComment({
        blog: blog?._id,
        user: currentUser._id,
        comment,
        notificationPayload: {
          user: blog?.user?._id,
          title: `${currentUser?.name} commented on your blog ${blog?.title}`,
          onClick: `/blog/${blog?._id}`,
        },
      });
      if (response.success) {
        getData();
        setComment("");
        setShowAddComment(false);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    blog && (
      <div className="p-2 flex flex-col gap-5">
        {currentUser?._id === blog?.user?._id && (
          <div className="flex justify-end gap-5">
            <Button
              onClick={() => deletBlog()}
              title="Delete"
              variant="primary-outlined"
            />
            <Button
              onClick={() => navigate(`/edit-blog/${blog?._id}`)}
              title="Edit"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold text-primary">{blog?.title}</h1>
        <hr />
        <h1>{blog?.description}</h1>
        <div>{ReactHtmlParser(draftToHtml(JSON.parse(blog?.content)))}</div>

        <hr />

        <div className="flex justify-between items-center">
          <div>
            <h1>Posted By: {blog.user.name}</h1>
            <h1>
              Posted On : {moment(blog.createdAt).format("DD-MM-YYYY hh:mm:ss")}
            </h1>
          </div>
          <div className="flex gap-5 items-center">
            <div
              className="flex gap-1 items-center cursor-pointer"
              onClick={likeOrUnlike}
            >
              <i
                className="ri-heart-fill"
                style={{ color: isAlreadyLiked ? "red" : "gray" }}
              ></i>
              <span>{blog.likesCount}</span>
            </div>
            <div className="flex gap-1 items-center cursor-pointer">
              <i class="ri-chat-1-line"></i>
              <span>{blog.commentsCount}</span>
            </div>
            <div
              className="flex gap-1 items-center cursor-pointer"
              onClick={() => {
                setShowShare(true);
                setShowComments(false);
              }}
            >
              <i class="ri-share-forward-line"></i>
              <span>{blog.sharesCount}</span>
            </div>
          </div>
        </div>

        <div>
          {!showAddComment && !showShare && (
            <div className="flex justify-end underline cursor-pointer">
              <h1 onClick={() => setShowAddComment(!showAddComment)}>
                Add Comment
              </h1>
            </div>
          )}
          {showAddComment && (
            <div className="flex flex-col gap-5 shadow p-5 border">
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end gap-5">
                <Button
                  title="Cancel"
                  onClick={() => setShowAddComment(false)}
                  variant="primary-outlined"
                />
                <Button title="Add Comment" onClick={addComment} />
              </div>
            </div>
          )}

          {showComments && (
            <div className="flex flex-col gap-5 mt-5">
              {comments.map((comment) => (
                <Comment comment={comment} getData={getData} />
              ))}
            </div>
          )}

          {showShare && (
            <Share
              blog={blog}
              setShowShare={setShowShare}
              setShowComments={setShowComments}
              getData={getData}
            />
          )}
        </div>
      </div>
    )
  );
}

export default BlogDescription;
