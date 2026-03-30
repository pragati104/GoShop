const env = import.meta.env;
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = env.VITE_API_URL;

export const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

httpRequest.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const token = auth?.state?.token;

  console.log("TOKEN:", token); // debug

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      isHydrated: false,
      setAuth: (data) =>
        set({
          user: data.user,
          token: data.token,
        }),

      setHydrated: () => set({ isHydrated: true }),

      signUp: async (values) => {
        set({ loading: true });
        try {
          const { data } = await axios.post("/auth/signup", values);

          set({
            user: {
              id: data.id,
              fullname: data.fullname,
              email: data.email,
              role: data.role,
            },
            token: data.token,
          });

          toast.success("Account created successfully");

          setTimeout(() => {
            window.location.replace("/");
          }, 1500);
        } catch (err) {
          toast.error(err?.response?.data?.message || "Signup failed");
        } finally {
          set({ loading: false });
        }
      },

      logIn: async (values) => {
        set({ loading: true });
        try {
          const { data } = await axios.post("/auth/login", values);

          set({
            user: {
              id: data.id,
              fullname: data.fullname,
              email: data.email,
              role: data.role,
            },
            token: data.token,
          });

          toast.success("Login success");

          setTimeout(() => {
            if (data.role === "admin") {
              window.location.replace("/admin/dashboard");
            } else {
              window.location.replace("/");
            }
          }, 1200);
        } catch (err) {
          toast.error(err?.response?.data?.message || "Login failed");
          set({ user: null, token: null });
        } finally {
          set({ loading: false });
        }
      },

      logOut: () => {
        set({ user: null, token: null });
        localStorage.removeItem("auth");
        toast.success("Logged out");
        window.location.replace("/login");
      },
    }),
    {
      name: "auth",

      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
