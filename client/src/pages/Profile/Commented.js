import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllBlogsByCommentedByUser } from "../../apicalls/blogs";
import moment from "moment";

function Liked() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllBlogsByCommentedByUser();
      if (response.success) {
        setBlogs(
          response.data.map((comment) => {
            return {
              ...comment.blog,
              commentedOn: moment(comment.createdAt).format("DD-MM-YYYY HH:mm"),
              createdAt: moment(comment.blog.createdAt).format("DD-MM-YYYY HH:mm"),
              comment : comment.comment
            };
          })
        );
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
    <div>
      <div className="border">
        <div className="grid grid-cols-6 bg-gray-200 p-5">
          <h1>Title</h1>
          <h1>Author</h1>
          <h1>Posted On</h1>
          <h1>Commented On</h1>
          <h1>Comment</h1>
          <h1>Actions</h1>
        </div>

        <div className="grid grid-cols-6 gap-5 mt-5 p-5">
          {blogs.map((blog) => (
            <>
              <h1>{blog.title}</h1>
              <h1>{blog.user.name}</h1>
              <h1>{blog.createdAt}</h1>
              <h1>{blog.commentedOn}</h1>
              <h1>{blog.comment}</h1>
              <div className="flex gap-2">
                <Button
                  title="View"
                  variant="primary-outlined"
                  onClick={() => navigate(`/blog-desc/${blog._id}`)}
                />
              </div>
              <div className="col-span-6">
                <hr />
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Liked;