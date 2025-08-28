// stores/AuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const AuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      setUser: (user) => set({ user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default AuthStore;
