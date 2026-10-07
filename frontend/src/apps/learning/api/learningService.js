import client from '@/core/api/client';

export const learningService = {
    // Courses
    getCourses: async () => {
        const response = await client.get('/api/learning/courses/');
        return response.data;
    },
    getCourse: async (id) => {
        const response = await client.get(`/api/learning/courses/${id}/`);
        return response.data;
    },
    createCourse: async (data) => {
        const response = await client.post('/api/learning/courses/', data);
        return response.data;
    },
    updateCourse: async (id, data) => {
        const response = await client.patch(`/api/learning/courses/${id}/`, data);
        return response.data;
    },
    deleteCourse: async (id) => {
        const response = await client.delete(`/api/learning/courses/${id}/`);
        return response.data;
    },

    // Contents (Lessons)
    getContents: async (courseId) => {
        const response = await client.get(`/api/learning/contents/?course=${courseId}`);
        return response.data;
    },
    
    // Dynamically used by admin pages
    getLearningCertifications: async () => client.get('/api/learning/certifications/').then(r => r.data),
    getLearningContents: async () => client.get('/api/learning/contents/').then(r => r.data),
    getLearningContentTags: async () => client.get('/api/learning/tags/').then(r => r.data),
    getLearningCourseGroups: async () => client.get('/api/learning/groups/').then(r => r.data),
    getLearningForums: async () => client.get('/api/learning/forums/').then(r => r.data),
    getLearningReports: async () => client.get('/api/learning/reports/').then(r => r.data),
    getLearningReviews: async () => client.get('/api/learning/reviews/').then(r => r.data),
    getLearningSettings: async () => client.get('/api/learning/settings/').then(r => r.data),
};

export default learningService;
