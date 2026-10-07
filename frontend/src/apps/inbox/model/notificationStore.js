import { create } from 'zustand';
import { inboxService } from '../api/inboxService';

export const useNotificationStore = create((set) => ({
  unreadCount: 0,
  inbox: [],
  wsConnection: null,
  
  // Actions can be added here
  // fetchInitialData: async () => {
  //   const data = await inboxService.getData();
  //   set({ data });
  // }
}));
