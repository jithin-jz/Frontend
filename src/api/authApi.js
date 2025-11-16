import api from "../utils/api";

export const authApi = {
  login: (email, password) =>
    api.post("/auth/login/", { email, password }),

  register: (first_name, last_name, email, password) =>
    api.post("/auth/register/", {
      first_name,
      last_name,
      email,
      password,
    }),

  googleLogin: (id_token) =>
    api.post("/auth/google/", { id_token }),

  logout: () => api.post("/auth/logout/"),
};
