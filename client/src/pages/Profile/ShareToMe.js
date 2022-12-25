import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import {
  GetAllBlogsBySharedToUser,
} from "../../apicalls/blogs";
import moment from "moment";

function SharedToMe() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllBlogsBySharedToUser();
      if (response.success) {
        setBlogs(
          response.data.map((share) => {
            return {
              title: share.blog.title,
              author: share.blog.user.name,
              blogPostedOn: moment(share.blog.createdAt).format(
                "DD-MM-YYYY HH:mm"
              ),
              sharedBy: share.sender.name,
              sharedOn: moment(share.createdAt).format("DD-MM-YYYY HH:mm"),
              blogId: share.blog._id,
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
          <h1>Shared By</h1>
          <h1>Shared On</h1>
          <h1>Actions</h1>
        </div>

        <div className="grid grid-cols-6 gap-5 mt-5 p-5">
          {blogs.map((blog) => (
            <>
              <h1>{blog.title}</h1>
              <h1>{blog.author}</h1>
              <h1>{blog.blogPostedOn}</h1>
              <h1>{blog.sharedBy}</h1>
              <h1>{blog.sharedOn}</h1>
              <div className="flex gap-2">
                <Button
                  title="View"
                  variant="primary-outlined"
                  onClick={() => navigate(`/blog-desc/${blog.blogId}`)}
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

export default SharedToMe;
