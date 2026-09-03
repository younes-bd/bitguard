import client from '@/core/api/client';

const base = 'projects';

export const projectsService = {
    // Projects
    getStats: () => client.get(`${base}/dashboard/stats/`).then(r => r.data),
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

    // Time Logs & Timesheets
    getTimeLogs: (params = {}) => client.get(`${base}/time-logs/`, { params }).then(r => r.data?.results ?? r.data ?? []),
    logTime: (data) => client.post(`${base}/time-logs/`, data).then(r => r.data),
    billTimeLog: (id) => client.post(`${base}/time-logs/${id}/bill/`).then(r => r.data),
    getTaskTimesheets: (params = {}) => client.get(`${base}/task-timesheets/`, { params }).then(r => r.data?.results ?? r.data ?? []),

    // Sprints & Tags
    getSprints: (params = {}) => client.get(`${base}/sprints/`, { params }).then(r => r.data?.results ?? r.data ?? []),
    createSprint: (data) => client.post(`${base}/sprints/`, data).then(r => r.data),
    getTaskTags: (params = {}) => client.get(`${base}/task-tags/`, { params }).then(r => r.data?.results ?? r.data ?? []),

    // Team
    getMembers: (projectId) => client.get(`${base}/projects/${projectId}/members/`).then(r => r.data),
    addMember: (projectId, userId) => client.post(`${base}/projects/${projectId}/add_member/`, { user_id: userId }).then(r => r.data),
    removeMember: (projectId, userId) => client.post(`${base}/projects/${projectId}/remove_member/`, { user_id: userId }).then(r => r.data),

    // â”€â”€â”€ DOCUMENT GENERATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    downloadDocument: async (model, id) => {
        const response = await client.post('reporting/generated/generate/', {
            record_model: model,
            record_id: id,
        });
        return response.data;
    }
};

export default projectsService;
