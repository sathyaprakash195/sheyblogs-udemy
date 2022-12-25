import moment from "moment";
import React from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { DeleteComment } from "../../apicalls/blogActions";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";

function Comment({ comment, getData }) {
  const {currentUser} = useSelector((state) => state.usersReducer);
  const dispatch = useDispatch();

  const deleteComment = async () => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteComment({
        blogId: comment.blog,
        commentId: comment._id,
      });
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

  return (
    <div className="bg-gray-100 border p-5 border-gray-300 flex flex-col gap-2 rounded">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h1 className="bg-gray-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-semibold">
            {comment.user.name[0].toUpperCase()}
          </h1>
          <h1 className="font-bold text-gray-600">{comment.user.name}</h1>
        </div>

        {currentUser._id === comment.user._id && <i class="ri-delete-bin-line" onClick={deleteComment}></i>}
      </div>
      <hr />
      <div>
        <h1>{comment.comment}</h1>
        <h1 className="text-sm text-gray-500">
          {moment(comment.createdAt).format("DD-MM-YYYY hh:mm:ss")}
        </h1>
      </div>
    </div>
  );
}

export default Comment;
