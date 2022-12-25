import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllBlogsByLikedByUser } from "../../apicalls/blogs";
import moment from "moment";

function Liked() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllBlogsByLikedByUser();
      if (response.success) {
        setBlogs(
          response.data.map((like) => {
            return {
              ...like.blog,
              likedOn: moment(like.createdAt).format("DD-MM-YYYY HH:mm"),
              createdAt: moment(like.blog.createdAt).format("DD-MM-YYYY HH:mm"),
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
        <div className="grid grid-cols-5 bg-gray-200 p-5">
          <h1>Title</h1>
          <h1>Owner / Posted By</h1>
          <h1>Posted On</h1>
          <h1>Liked On</h1>
          <h1>Actions</h1>
        </div>

        <div className="grid grid-cols-5 gap-5 mt-5 p-5">
          {blogs.map((blog) => (
            <>
              <h1>{blog.title}</h1>
              <h1>{blog.user.name}</h1>
              <h1>{blog.createdAt}</h1>
              <h1>{blog.likedOn}</h1>
              <div className="flex gap-2">
                <Button
                  title="View"
                  variant="primary-outlined"
                  onClick={() => navigate(`/blog-desc/${blog._id}`)}
                />
              </div>
              <div className="col-span-5">
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
