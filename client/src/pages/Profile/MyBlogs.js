import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllBlogsByUser , DeleteBlog} from "../../apicalls/blogs";
import moment from "moment";

function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllBlogsByUser();
      if (response.success) {
        setBlogs(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const deletBlog = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteBlog(id);
      if (response.success) {
        toast.success(response.message);
        getData();
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
      <div className='border'>
        <div className="grid grid-cols-3 bg-gray-200 p-5">
          <h1>Title</h1>
          <h1>Posted On</h1>
          <h1>Actions</h1>
        </div>

        <div className="grid grid-cols-3 gap-5 mt-5 p-5">
          {blogs.map((blog) => (
            <>
              <h1>{blog.title}</h1>
              <h1>{moment(blog.createdAt).format("DD-MM-YYYY HH:mm")}</h1>
              <div className="flex gap-2">
                <Button
                  title="Edit"
                  variant="primary-outlined"
                  onClick={() => navigate(`/edit-blog/${blog._id}`)}
                />
                <Button
                  title="Delete"
                  variant="primary-outlined"
                  onClick={() => deletBlog(blog._id)}
                />
              </div>
              <div className="col-span-3">
                <hr />
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyBlogs;
