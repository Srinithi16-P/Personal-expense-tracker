import axiosClient from "./axiosClient";

export const getDashboardSummary = () => axiosClient.get("/analytics/dashboard");
export const getCategoryBreakdown = (params) => axiosClient.get("/analytics/category", { params });
export const getMonthlyTrend = () => axiosClient.get("/analytics/monthly");
export const getSavingsPrediction = () => axiosClient.get("/analytics/savings-prediction");
export const getSpendingPersonality = () => axiosClient.get("/analytics/spending-personality");
