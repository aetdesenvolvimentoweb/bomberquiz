export const apiHost =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3333/api"
    : "https://bomberquiz-api.onrender.com/api";
