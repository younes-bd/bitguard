import client from '@/core/api/client';

export const elearningService = {
    // Courses
    getCourses: async () => {
        const response = await client.get('/api/elearning/courses/');
        return response.data;
    },
    getCourse: async (id) => {
        const response = await client.get(`/api/elearning/courses/${id}/`);
        return response.data;
    },
    createCourse: async (data) => {
        const response = await client.post('/api/elearning/courses/', data);
        return response.data;
    },
    updateCourse: async (id, data) => {
        const response = await client.patch(`/api/elearning/courses/${id}/`, data);
        return response.data;
    },
    deleteCourse: async (id) => {
        const response = await client.delete(`/api/elearning/courses/${id}/`);
        return response.data;
    },

    // Contents (Lessons)
    getContents: async (courseId) => {
        const response = await client.get(`/api/elearning/contents/?course=${courseId}`);
        return response.data;
    },
    
    // Dynamically used by admin pages
    getElearningCertifications: async () => client.get('/api/elearning/certifications/').then(r => r.data),
    getElearningContents: async () => client.get('/api/elearning/contents/').then(r => r.data),
    getElearningContentTags: async () => client.get('/api/elearning/tags/').then(r => r.data),
    getElearningCourseGroups: async () => client.get('/api/elearning/groups/').then(r => r.data),
    getElearningForums: async () => client.get('/api/elearning/forums/').then(r => r.data),
    getElearningReports: async () => client.get('/api/elearning/reports/').then(r => r.data),
    getElearningReviews: async () => client.get('/api/elearning/reviews/').then(r => r.data),
    getElearningSettings: async () => client.get('/api/elearning/settings/').then(r => r.data),
};

export default elearningService;
