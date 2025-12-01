import { create } from 'zustand';
import { authApi } from '../api/authApi';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  loadUser: async () => {
    try {
      const res = await authApi.me();
      set({ user: res.data, loading: false });
      return res.data;
    } catch (error) {
      set({ user: null, loading: false });
      return null;
    }
  },

  login: async (email, password) => {
    await authApi.login(email, password);
    return get().loadUser();
  },

  register: async (first_name, last_name, email, password) => {
    await authApi.register(first_name, last_name, email, password);
    return get().loadUser();
  },

  googleLogin: async (credential) => {
    await authApi.googleLogin(credential);
    return get().loadUser();
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
    set({ user: null });
  },
}));

export default useAuthStore;
