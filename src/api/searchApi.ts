// api/post.ts
import axiosInstance from './axiosInstance';

export const searchPosts = async (query: string) => {
  const res = await axiosInstance.get('/search/', {
    params: { search: query },
  });
  return res.data;
};
