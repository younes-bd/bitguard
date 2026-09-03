import { create } from 'zustand';
import { projectsService } from '../api/projectsService';

export const useProjectStore = create((set) => ({
  projects: [],
  tasks: [],
  activeProject: null,
  kanbanView: true,
  
  // Actions can be added here
  // fetchInitialData: async () => {
  //   const data = await projectsService.getData();
  //   set({ data });
  // }
}));
