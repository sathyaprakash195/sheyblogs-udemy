import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: null,
    users: [],
    notifications: {
      read: [],
      unread: [],
    },
    socket: null,
    unreadCount: 0,
  },
  reducers: {
    SetCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    SetAllUsers: (state, action) => {
      state.users = action.payload;
    },
    SetNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    SetSocket: (state, action) => {
      state.socket = action.payload;
    },
    SetUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
});

export const { SetCurrentUser, SetAllUsers, SetNotifications, SetSocket , SetUnreadCount} =
  usersSlice.actions;
export default usersSlice.reducer;
