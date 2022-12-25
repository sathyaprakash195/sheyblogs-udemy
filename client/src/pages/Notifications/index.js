import moment from "moment";
import React from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllNotifications,
  MarkAllNotificationsAsRead,
} from "../../apicalls/notifications";
import Tabs from "../../components/Tabs";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { SetNotifications, SetUnreadCount } from "../../redux/usersSlice";
import Notification from "./Notification";

function Notifications() {
  const [activeTab, setActiveTab] = React.useState(0);
  const { notifications } = useSelector((state) => state.usersReducer);

  const getNotifications = async () => {
    try {
      dispatch(ShowLoading());

      const notificationsResponse = await GetAllNotifications();
      if (notificationsResponse.success) {
        const notificationsTemp = {
          read: notificationsResponse.data.filter(
            (notification) => notification.read
          ),
          unread: notificationsResponse.data.filter(
            (notification) => !notification.read
          ),
        };
        dispatch(SetNotifications(notificationsTemp));
        dispatch(SetUnreadCount(notificationsTemp.unread.length));
      }

      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const dispatch = useDispatch();
  const tabs = [
    {
      name: "Unread",
      component: <Notification notifications={notifications?.unread || []} />,
    },
    {
      name: "Read",
      component: <Notification notifications={notifications.read} />,
    },
    {
      name: "All",
      component: (
        <Notification
          notifications={[...notifications.unread, ...notifications.read]}
        />
      ),
    },
  ];

  const markAsRead = async () => {
    try {
      dispatch(ShowLoading());
      const response = await MarkAllNotificationsAsRead();
      if (response.success) {
        dispatch(
          SetNotifications({
            read: response.data.filter((notification) => notification.read),
            unread: response.data.filter((notification) => !notification.read),
          })
        );
        dispatch(SetUnreadCount(0));
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  React.useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div>
      <h1 className="text-primary text-xl font-bold uppercase cursor-pointer">
        Notifications
      </h1>
      <div className="flex justify-end">
        <h1 className="underline cursor-pointer" onClick={markAsRead}>
          Mark all as read
        </h1>
      </div>
      <div className="mt-5">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

export default Notifications;
