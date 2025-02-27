import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      role: null,
      name: null,
      setAuth: (token, role, name) => set({ token, role, name }),
      logout: () => set({ token: null, role: null, name: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;