import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPost, updatePost, getCategories } from '../api/postApi';
import toast from 'react-hot-toast';

interface Author {
  id: number;
  username: string;
}

interface Category {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: Author;
  category: number;
  cover_image?: string;
  is_published: boolean; // <--- ADD THIS
}

export default function UpdatePostForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => getPost(Number(id)),
    enabled: !!id,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Local state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isPublished, setIsPublished] = useState(false); // <--- NEW STATE
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Populate fields
  useEffect(() => {
    if (!post) return;

    setTitle(post.title);
    setContent(post.content);
    setCategoryId(post.category);
    setIsPublished(post.is_published); // <--- LOAD VALUE
    setImagePreview(post.cover_image || null);
  }, [post]);

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => updatePost(Number(id), formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast.success('Post updated successfully!');
      navigate('/admin/dashboard');
    },
    onError: () => {
      toast.error('Error updating post!');
    },
  });

  const handleImageChange = (fileList: FileList | null) => {
    if (!fileList?.length) {
      setCoverImage(null);
      setImagePreview(post?.cover_image || null);
      return;
    }
    const file = fileList[0];
    setCoverImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    const formData = new FormData();
    formData.append('author', post.author.toString());
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', (categoryId ?? post.category).toString());
    formData.append('is_published', isPublished ? 'true' : 'false'); // <--- SEND TO BACKEND

    if (coverImage) formData.append('cover_image', coverImage);

    mutate(formData);
  };

  if (!post) return <div className="py-20 text-center">Loading post...</div>;

  return (
    <div className="mx-auto flex max-w-[960px] justify-center px-4 pt-[120px] pb-[60px]">
      <div className="w-full max-w-[600px] rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">Edit Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border p-3"
            />
          </div>

          {/* Content */}
          <div>
            <label className="font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 h-40 w-full rounded-xl border p-3"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-medium">Category</label>
            <select
              value={categoryId ?? post.category}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border p-3"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-5 w-5"
            />
            <label className="font-medium">Publish this post</label>
          </div>

          {/* Cover Image */}
          <div>
            <label className="font-medium">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files)}
              className="mt-1 w-full rounded-xl border p-3"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 h-48 w-full rounded-xl object-cover shadow"
            />
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 py-3 text-lg text-white hover:bg-blue-700"
          >
            {isPending ? 'Updating...' : 'Update Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
