import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";

function Notification({notifications}) {
  const navigate = useNavigate();
  return (
    <div>
      {notifications.map((notification) => (
        <div className="bg-white p-5 rounded shadow mt-5 border flex flex-col"
            onClick={()=>navigate(notification.onClick)}
         >
          <h1>{notification.title}</h1>
          <span className="text-gray-500 text-sm">
            {moment(notification.createdAt).fromNow()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Notification;
