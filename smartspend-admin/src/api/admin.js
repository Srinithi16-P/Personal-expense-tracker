import axiosClient from "./axiosClient";

export const loginUser = (data) => axiosClient.post("/auth/login", data);
export const getMe = () => axiosClient.get("/auth/me");

export const getSystemStats = () => axiosClient.get("/admin/system-stats");
export const getAllUsers = () => axiosClient.get("/admin/users");
export const toggleUserStatus = (id) => axiosClient.put(`/admin/user-status/${id}`);
export const sendAnnouncement = (data) => axiosClient.post("/admin/announcement", data);
export const getAllFeedback = () => axiosClient.get("/admin/feedback");
export const updateFeedbackStatus = (id, status) => axiosClient.put(`/admin/feedback/${id}`, { status });
