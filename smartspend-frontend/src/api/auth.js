import axiosClient from "./axiosClient";

export const registerUser = (data) => axiosClient.post("/auth/register", data);
export const loginUser = (data) => axiosClient.post("/auth/login", data);
export const forgotPassword = (data) => axiosClient.post("/auth/forgot-password", data);
export const resetPassword = (token, data) => axiosClient.post(`/auth/reset-password/${token}`, data);
export const getMe = () => axiosClient.get("/auth/me");

export const getProfile = () => axiosClient.get("/user/profile");
export const updateProfile = (data) => axiosClient.put("/user/profile", data);
export const changePassword = (data) => axiosClient.put("/user/change-password", data);
