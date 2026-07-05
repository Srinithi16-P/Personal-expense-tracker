import axiosClient from "./axiosClient";

export const addIncome = (data) => axiosClient.post("/income/add", data);
export const getIncomes = (params) => axiosClient.get("/income", { params });
export const updateIncome = (id, data) => axiosClient.put(`/income/${id}`, data);
export const deleteIncome = (id) => axiosClient.delete(`/income/${id}`);
