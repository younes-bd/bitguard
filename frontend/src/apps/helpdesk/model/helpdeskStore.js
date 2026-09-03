import { create } from 'zustand';
import { helpdeskService } from '../api/helpdeskService';

export const useHelpdeskStore = create((set) => ({
  tickets: [],
  myTickets: [],
  slaStats: {},
  
  // Actions can be added here
  // fetchInitialData: async () => {
  //   const data = await helpdeskService.getData();
  //   set({ data });
  // }
}));
