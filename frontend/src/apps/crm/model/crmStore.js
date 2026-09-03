import { create } from 'zustand';
import { crmService } from '../api/crmService';

export const useCrmStore = create((set) => ({
  leads: [],
  deals: [],
  stages: [],
  activeFilters: {},
  
  // Actions can be added here
  // fetchInitialData: async () => {
  //   const data = await crmService.getData();
  //   set({ data });
  // }
}));
