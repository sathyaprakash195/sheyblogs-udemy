const { axiosInstance } = require(".");

// get all notifications of a user

export const GetAllNotifications = async () => {
  try {
    const response = await axiosInstance.get(
      `/api/users/get-all-notifications`
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// mark all notifications as read

export const MarkAllNotificationsAsRead = async () => {
  try {
    const response = await axiosInstance.post(
      `/api/users/mark-all-notifications-as-read`
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
