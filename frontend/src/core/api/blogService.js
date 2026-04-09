import client from './client';

const blogService = {
    // Fetch a paginated list of blog posts
    getPosts: async (params = {}) => {
        const response = await client.get('blog/posts/', { params });
        return response.data.data;
    },

    // Fetch a single blog post by slug
    getPostBySlug: async (slug) => {
        const response = await client.get(`blog/posts/${slug}/`);
        return response.data.data;
    },

    // Fetch all blog categories
    getCategories: async () => {
        const response = await client.get('blog/categories/');
        return response.data.data;
    }
};

export default blogService;
