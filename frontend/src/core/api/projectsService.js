import client from './client';

const base = 'projects';

export const projectsService = {
    // Projects
    getStats: () => client.get(`${base}/projects/stats/`).then(r => r.data),
    getProjects: (params = {}) => client.get(`${base}/projects/`, { params }).then(r => r.data),
    getProject: (id) => client.get(`${base}/projects/${id}/`).then(r => r.data),
    createProject: (data) => client.post(`${base}/projects/`, data).then(r => r.data),
    updateProject: (id, data) => client.patch(`${base}/projects/${id}/`, data).then(r => r.data),
    updateStatus: (id, status) => client.patch(`${base}/projects/${id}/update_status/`, { status }).then(r => r.data),
    deleteProject: (id) => client.delete(`${base}/projects/${id}/`),

    // Tasks
    getTasks: (params = {}) => client.get(`${base}/tasks/`, { params }).then(r => r.data?.results ?? r.data ?? []),
    createTask: (data) => client.post(`${base}/tasks/`, data).then(r => r.data),
    updateTask: (id, data) => client.patch(`${base}/tasks/${id}/`, data).then(r => r.data),
    moveTask: (id, status, order = 0) => client.patch(`${base}/tasks/${id}/move/`, { status, order }).then(r => r.data),
    deleteTask: (id) => client.delete(`${base}/tasks/${id}/`),

    // Milestones
    getMilestones: (projectId) => client.get(`${base}/milestones/`, { params: { project: projectId } }).then(r => r.data?.results ?? r.data ?? []),
    createMilestone: (data) => client.post(`${base}/milestones/`, data).then(r => r.data),
    completeMilestone: (id) => client.post(`${base}/milestones/${id}/complete/`).then(r => r.data),

    // Time Logs
    getTimeLogs: (params = {}) => client.get(`${base}/time-logs/`, { params }).then(r => r.data?.results ?? r.data ?? []),
    logTime: (data) => client.post(`${base}/time-logs/`, data).then(r => r.data),
};

export default projectsService;
