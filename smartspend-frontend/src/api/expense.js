import axiosClient from "./axiosClient";

export const addExpense = (data) => axiosClient.post("/expense/add", data);
export const getExpenses = (params) => axiosClient.get("/expense", { params });
export const updateExpense = (id, data) => axiosClient.put(`/expense/${id}`, data);
export const deleteExpense = (id) => axiosClient.delete(`/expense/${id}`);
