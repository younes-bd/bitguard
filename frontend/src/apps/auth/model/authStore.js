import { create } from 'zustand';
import { authService } from '../api/authService';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  tenant: null,
  
  // Actions can be added here
  // fetchInitialData: async () => {
  //   const data = await authService.getData();
  //   set({ data });
  // }
}));
