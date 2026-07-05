import axiosClient from "./axiosClient";

export const createBudget = (data) => axiosClient.post("/budget/create", data);
export const getBudgets = (params) => axiosClient.get("/budget", { params });
export const updateBudget = (id, data) => axiosClient.put(`/budget/${id}`, data);
export const deleteBudget = (id) => axiosClient.delete(`/budget/${id}`);
