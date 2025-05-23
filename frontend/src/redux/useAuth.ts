import { create } from 'zustand'
import { persist } from 'zustand/middleware' // tuỳ đường dẫn của bạn
import { UserType } from '../type'
import { loginUser } from '../services/users'

type AuthStore = {
  user: UserType | null
  loading: boolean
  setUser: (user: UserType | null) => void
  setLoading: (loading: boolean) => void
  login: (userName: string, password: string) => Promise<any>
  logout: () => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),

      login: async (userName, password) => {
        set({ loading: true });
        try {
          const { user, status, message, token } = await loginUser({ userName, password });

          if (status !== 200) throw new Error(message);
          sessionStorage.setItem("token", token);
          set({ user });
          set({ loading: false });
          return { status: 200, user, message: "thành công" };
        } catch (error) {
          console.error("Lỗi đăng nhập:", error);
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null });
        localStorage.removeItem("cart");
        localStorage.removeItem("order-items");
      },
    }),
    {
      name: 'user',
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        }
      },
      partialize: (state) => ({ user: state.user }),
    }
  )
);
