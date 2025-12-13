import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import '../assets/css/create-post.css';

interface FormData {
  author: string; // will hold author ID
  category: string;
  title: string;
  content: string;
  cover_image: FileList;
}

interface Category {
  id: string;
  name: string;
}

// Define JWT payload type (adjust according to your backend)
interface JwtPayload {
  user_id: number;
  username?: string;
  exp: number;
}

export default function CreatePost() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authorId, setAuthorId] = useState<string | number>('');

  // Decode access token to get user id
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setAuthorId(decoded.user_id); // set user_id as author
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, []);

  //console.log(authorId);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories/');
        //console.log(res.data.results)
        setCategories(res.data.results);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: FormData) => {
    //console.log(data);

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('author', String(authorId)); // use decoded author ID
      formData.append('category_id', data.category);
      formData.append('title', data.title);
      formData.append('content', data.content);

      if (data.cover_image?.length > 0) {
        formData.append('cover_image', data.cover_image[0]);
      }

      await axiosInstance.post('/user-posts/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      reset();
      setImagePreview(null);
      toast.success('Post created successfully!');
      //alert('Post created successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Error creating post!');
      //alert('Error creating post!');
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (fileList: FileList | null) => {
    if (!fileList?.length) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(fileList[0]);
    setImagePreview(url);
  };

  return (
    <div className="create-post-form-container">
      <div className="create-post-form-card">
        <h2 className="create-post-form-title">Create New Blog Post</h2>
        <p className="create-post-form-subtitle">Fill the fields below</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Author ID hidden */}
          <input type="hidden" value={authorId} {...register('author')} />

          {/* Category Dropdown */}
          <label className="create-post-form-label">Category</label>
          <select {...register('category', { required: true })} className="create-post-form-input">
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Title */}
          <label className="create-post-form-label">Title</label>
          <input
            {...register('title', { required: true })}
            type="text"
            className="create-post-form-input"
            placeholder="Enter title"
          />

          {/* Content */}
          <label className="create-post-form-label">Content</label>
          <textarea
            {...register('content', { required: true })}
            className="create-post-form-textarea"
            placeholder="Write your blog content..."
          />

          {/* Cover Image */}
          <label className="create-post-form-label">Cover Image</label>
          <input
            {...register('cover_image')}
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e.target.files)}
            className="create-post-form-file"
          />

          {/* Preview */}
          {imagePreview && (
            <img src={imagePreview} className="create-post-form-preview" alt="Preview" />
          )}

          <button type="submit" disabled={loading} className="create-post-form-btn">
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
