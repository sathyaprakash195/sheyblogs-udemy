import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ShareBlog } from "../../apicalls/blogActions";
import { SearchUsers } from "../../apicalls/users";
import Button from "../../components/Button";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";

function Share({ blog, setShowShare, setShowComments, getData }) {
  const [users = [], setUsers = []] = useState([]);
  const [searchText = "", setSearchText = ""] = useState("");
  const [selectedUsers = [], setSelectedUsers = []] = useState([]);
  const { currentUser, socket } = useSelector((state) => state.usersReducer);
  const dispatch = useDispatch();
  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await SearchUsers(searchText);
      if (response.success) {
        setUsers(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      toast.error(error.message);
      dispatch(HideLoading());
    }
  };

  const share = async () => {
    try {
      dispatch(ShowLoading());

      for (let i = 0; i < selectedUsers.length; i++) {
        socket.emit("newNotification", {
          userId: selectedUsers[i],
          title: `${currentUser.name} shared a blog with you`,
        });
      }

      const response = await ShareBlog({
        blog,
        selectedUsers,
        sender: currentUser._id,
        senderName: currentUser.name,
      });
      if (response.success) {
        toast.success(response.message);
        setShowShare(false);
        setShowComments(true);
        getData();
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      toast.error(error.message);
      dispatch(HideLoading());
    }
  };

  return (
    <div className="border p-5">
      <h1>
        Share <span className="font-bold">{blog.title}</span>
      </h1>
      <div className="flex gap-5 mt-5 items-center">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-1/2"
          placeholder="Search for people"
        />
        <Button title="Search" onClick={getUsers} />
      </div>

      <div className="grid grid-cols-3 gap-5 mt-5">
        {users.map((user) => (
          <div
            className={`flex flex-col border p-3 cursor-pointer
              ${
                selectedUsers.includes(user._id)
                  ? "border-primary border-2"
                  : ""
              }
            `}
            onClick={() => {
              if (selectedUsers.includes(user._id)) {
                setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
              } else {
                setSelectedUsers([...selectedUsers, user._id]);
              }
            }}
          >
            <h1>{user.name}</h1>
            <h1>{user.email}</h1>
          </div>
        ))}
      </div>

      <div className="flex gap-5 mt-5">
        <Button
          title="Cancel"
          variant="primary-outlined"
          onClick={() => {
            setShowShare(false);
            setShowComments(true);
          }}
        />
        <Button title="Share" onClick={share} />
      </div>
    </div>
  );
}

export default Share;
