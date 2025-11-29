import axios from 'axios';

const API_BASE = 'https://jsonplaceholder.typicode.com';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Failed to fetch users' };
  }
};

export const fetchPosts = async () => {
  try {
    const response = await api.get('/posts?_limit=10');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Failed to fetch posts' };
  }
};

export const createPost = async (postData: any) => {
  try {
    const response = await api.post('/posts', postData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Failed to create post' };
  }
};

export const updatePost = async (id: number, postData: any) => {
  try {
    const response = await api.put(`/posts/${id}`, postData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Failed to update post' };
  }
};

export const deletePost = async (id: number) => {
  try {
    await api.delete(`/posts/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete post' };
  }
};