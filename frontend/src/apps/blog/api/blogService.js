import client from '@/core/api/client';

const blogService = {
    getPosts: async (params = {}) => {
        const res = await client.get('blog/posts/', { params });
        return res.data?.results ?? res.data?.data ?? res.data ?? [];
    },
    getPost: async (id) => {
        const res = await client.get(`blog/posts/${id}/`);
        return res.data?.data ?? res.data;
    },
    getPostBySlug: async (slug) => {
        const res = await client.get(`blog/posts/${slug}/`);
        return res.data?.data ?? res.data;
    },
    createPost: async (data) => {
        const res = await client.post('blog/posts/', data);
        return res.data;
    },
    updatePost: async (id, data) => {
        const res = await client.patch(`blog/posts/${id}/`, data);
        return res.data;
    },
    deletePost: async (id) => client.delete(`blog/posts/${id}/`),
    getCategories: async () => {
        const res = await client.get('blog/categories/');
        return res.data?.results ?? res.data?.data ?? res.data ?? [];
    },
};

export default blogService;
