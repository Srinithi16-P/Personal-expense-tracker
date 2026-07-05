import axiosClient from "./axiosClient";

export const submitFeedback = (data) => axiosClient.post("/feedback", data);
export const getMyFeedback = () => axiosClient.get("/feedback");
