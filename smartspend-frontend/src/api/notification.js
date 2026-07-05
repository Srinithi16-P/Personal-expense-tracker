import axiosClient from "./axiosClient";

export const getNotifications = () => axiosClient.get("/notification");
export const markRead = (id) => axiosClient.put(`/notification/read/${id}`);
export const markAllRead = () => axiosClient.put("/notification/read-all");
export const deleteNotification = (id) => axiosClient.delete(`/notification/${id}`);
