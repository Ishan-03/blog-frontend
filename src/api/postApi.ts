import axiosInstance from './axiosInstance';

/* -------------------------------------------------------------------------- */
/*                                TYPE DEFINITIONS                             */
/* -------------------------------------------------------------------------- */

export interface Category {
  secure_id: string;
  name: string;
}

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
}

export interface Post {
  secure_id: string;
  title: string;
  content: string;
  image?: string;
  category?: Category;
  author?: User;
  created_at: string;
  updated_at: string;
}

/* -------------------------------------------------------------------------- */
/*                           INTERNAL HELPER FUNCTIONS                         */
/* -------------------------------------------------------------------------- */

// Ensures API always returns an array (prevents .map errors)
const safeResults = (data: any) => {
  return Array.isArray(data?.results) ? data.results : [];
};

/* ========================================================================== */
/*                               PUBLIC (OPEN) APIs                            */
/* ========================================================================== */

/**
 * Get all categories (public)
 */
export const getCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get('/categories/');
  return safeResults(res.data);
};

/**
 * Get posts by category secure_id (public)
 */
export const getPostsByCategory = async (categorySecureId: string): Promise<Post[]> => {
  const res = await axiosInstance.get(
    `/category-list/?category=${encodeURIComponent(categorySecureId)}`,
  );

  return safeResults(res.data);
};

/**
 * Get all posts (public)
 */
export const getPosts = async (): Promise<Post[]> => {
  const res = await axiosInstance.get('/post/');
  return safeResults(res.data);
};

/**
 * Get single post by ID (public view)
 * NOTE: This is NOT secure_id — admin uses numeric ID.
 */
export const getPost = async (id: number): Promise<Post> => {
  const res = await axiosInstance.get(`/admin/retrieve/${id}/`);
  return res.data;
};

/* ========================================================================== */
/*                                USER APIs                                   */
/*               (Posts created by authenticated users with secure_id)        */
/* ========================================================================== */

/**
 * Get currently logged-in user's posts
 */
export const getUserPosts = async (): Promise<Post[]> => {
  const res = await axiosInstance.get('/user-posts/');
  return safeResults(res.data);
};

/**
 * Get a user post by secure_id
 */
export const getUserPost = async (secure_id: string): Promise<Post> => {
  const res = await axiosInstance.get(`/user-posts/${secure_id}/`);
  return res.data;
};

/**
 * Create a new user post
 */
export const createUserPost = async (data: FormData) => {
  return axiosInstance.post('/user-posts/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Update a user post by secure_id
 */
export const updateUserPost = async (secure_id: string, data: FormData) => {
  return axiosInstance.put(`/user-posts/${secure_id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Delete a user post by secure_id
 */
export const deleteUserPost = async (secure_id: string) => {
  return axiosInstance.delete(`/user-posts/${secure_id}/`);
};

/* ========================================================================== */
/*                                ADMIN APIs                                  */
/*                       (Full CRUD for admin dashboard)                      */
/* ========================================================================== */

/**
 * Create a post (admin)
 */
export const createPost = async (data: FormData) => {
  return axiosInstance.post('/post/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Update a post by ID (admin)
 */
export const updatePost = async (id: number, data: FormData) => {
  return axiosInstance.put(`/admin/update/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Delete a post by ID (admin)
 */
export const deletePost = async (id: number) => {
  return axiosInstance.delete(`/admin/delete/${id}/`);
};
