import { create } from 'zustand';
import { notificationsService } from '../api/notificationsService';

export const useNotificationStore = create((set) => ({
  unreadCount: 0,
  notifications: [],
  wsConnection: null,
  
  // Actions can be added here
  // fetchInitialData: async () => {
  //   const data = await notificationsService.getData();
  //   set({ data });
  // }
}));
