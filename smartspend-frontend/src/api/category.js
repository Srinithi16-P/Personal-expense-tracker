import axiosClient from "./axiosClient";

export const getCategories = (type) => axiosClient.get("/category", { params: type ? { type } : {} });
export const addCategory = (data) => axiosClient.post("/category", data);
export const deleteCategory = (id) => axiosClient.delete(`/category/${id}`);
