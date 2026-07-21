import client from './client';

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
    }
};

export default elearningService;
