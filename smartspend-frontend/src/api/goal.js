import axiosClient from "./axiosClient";

export const createGoal = (data) => axiosClient.post("/goal/create", data);
export const getGoals = () => axiosClient.get("/goal");
export const updateGoal = (id, data) => axiosClient.put(`/goal/${id}`, data);
export const deleteGoal = (id) => axiosClient.delete(`/goal/${id}`);
