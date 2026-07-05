
export const getErrorMessage = (err, fallback = "Something went wrong.") => {
  const data = err?.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (first) return first;
  }
  return data?.message || fallback;
};
