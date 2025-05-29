export const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token || ""; // Adjust based on how you store it
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};
