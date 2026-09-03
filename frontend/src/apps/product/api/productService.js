import client from '../../../core/api/client';

const BASE = 'product';

const productService = {
  // Products
  getProducts: (params = {}) => client.get(`${BASE}/products/`, { params }),
  getProduct: (id) => client.get(`${BASE}/products/${id}/`),
  createProduct: (data) => client.post(`${BASE}/products/`, data),
  updateProduct: (id, data) => client.put(`${BASE}/products/${id}/`, data),
  patchProduct: (id, data) => client.patch(`${BASE}/products/${id}/`, data),
  deleteProduct: (id) => client.delete(`${BASE}/products/${id}/`),
  archiveProduct: (id) => client.post(`${BASE}/products/${id}/archive/`),
  unarchiveProduct: (id) => client.post(`${BASE}/products/${id}/unarchive/`),
  duplicateProduct: (id) => client.post(`${BASE}/products/${id}/duplicate/`),
  getProductStats: () => client.get(`${BASE}/products/stats/`),
  checkoutProduct: (id, data) => client.post(`${BASE}/products/${id}/checkout/`, data),

  // Categories
  getCategories: (params = {}) => client.get(`${BASE}/categories/`, { params }),
  getCategory: (id) => client.get(`${BASE}/categories/${id}/`),
  createCategory: (data) => client.post(`${BASE}/categories/`, data),
  updateCategory: (id, data) => client.put(`${BASE}/categories/${id}/`, data),
  patchCategory: (id, data) => client.patch(`${BASE}/categories/${id}/`, data),
  deleteCategory: (id) => client.delete(`${BASE}/categories/${id}/`),

  // Attributes
  getAttributes: (params = {}) => client.get(`${BASE}/attributes/`, { params }),
  getAttribute: (id) => client.get(`${BASE}/attributes/${id}/`),
  createAttribute: (data) => client.post(`${BASE}/attributes/`, data),
  updateAttribute: (id, data) => client.put(`${BASE}/attributes/${id}/`, data),
  deleteAttribute: (id) => client.delete(`${BASE}/attributes/${id}/`),

  // Attribute Values
  getAttributeValues: (params = {}) => client.get(`${BASE}/attribute-values/`, { params }),
  createAttributeValue: (data) => client.post(`${BASE}/attribute-values/`, data),
  updateAttributeValue: (id, data) => client.put(`${BASE}/attribute-values/${id}/`, data),
  deleteAttributeValue: (id) => client.delete(`${BASE}/attribute-values/${id}/`),

  // Variants
  getVariants: (params = {}) => client.get(`${BASE}/variants/`, { params }),
  getVariant: (id) => client.get(`${BASE}/variants/${id}/`),
  createVariant: (data) => client.post(`${BASE}/variants/`, data),
  updateVariant: (id, data) => client.put(`${BASE}/variants/${id}/`, data),
  deleteVariant: (id) => client.delete(`${BASE}/variants/${id}/`),

  // Reviews
  getReviews: (params = {}) => client.get(`${BASE}/reviews/`, { params }),
  approveReview: (id) => client.post(`${BASE}/reviews/${id}/approve/`),
  rejectReview: (id) => client.post(`${BASE}/reviews/${id}/reject/`),
  deleteReview: (id) => client.delete(`${BASE}/reviews/${id}/`),

  // Tags
  getTags: (params = {}) => client.get(`${BASE}/tags/`, { params }),
  createTag: (data) => client.post(`${BASE}/tags/`, data),
  updateTag: (id, data) => client.put(`${BASE}/tags/${id}/`, data),
  deleteTag: (id) => client.delete(`${BASE}/tags/${id}/`),
};

export default productService;
