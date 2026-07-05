import axiosClient, { API_BASE_URL } from "./axiosClient";

export const getMonthlyReportJSON = (params) => axiosClient.get("/report/monthly", { params });

export const downloadReport = (type, params, token) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/api/report/download/${type}?${query}`;
  
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(async (res) => {
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `SmartSpend_Report.${type === "pdf" ? "pdf" : "xlsx"}`;
    link.click();
  });
};
