import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

import { type Post, type Category, getPost, updatePost, getCategories } from '../api/postApi';

/* ───────────────────────────── */
/* TYPES                         */
/* ───────────────────────────── */

type FormValues = {
  title: string;
  content: string;
  category_id: string;
  is_published: boolean;
  cover_image: File | null;
};

/* ───────────────────────────── */
/* COMPONENT                     */
/* ───────────────────────────── */

export default function UpdatePostForm() {
  const { secure_id } = useParams<{ secure_id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* ───────────────────────────── */
  /* FETCH POST                    */
  /* ───────────────────────────── */

  const {
    data: post,
    isLoading: postLoading,
    isError: postError,
  } = useQuery<Post>({
    queryKey: ['post', secure_id],
    queryFn: () => getPost(secure_id!),
    enabled: !!secure_id,
  });

  /* ───────────────────────────── */
  /* FETCH CATEGORIES              */
  /* ───────────────────────────── */

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  /* ───────────────────────────── */
  /* FORM                          */
  /* ───────────────────────────── */

  const { register, handleSubmit, reset, setValue, control } = useForm<FormValues>({
    defaultValues: {
      title: '',
      content: '',
      category_id: '',
      is_published: false,
      cover_image: null,
    },
  });

  /* ───────────────────────────── */
  /* SYNC POST → FORM (SAFE)       */
  /* ───────────────────────────── */

  useEffect(() => {
    if (!post) return;

    reset({
      title: post.title,
      content: post.content,
      category_id: post.category?.secure_id ?? '',
      is_published: post.is_published,
      cover_image: null,
    });
  }, [post, reset]);

  /* ───────────────────────────── */
  /* IMAGE PREVIEW                 */
  /* ───────────────────────────── */

  const coverImage = useWatch({
    control,
    name: 'cover_image',
  });

  const imagePreview = useMemo(() => {
    if (coverImage instanceof File) {
      return URL.createObjectURL(coverImage);
    }
    return post?.cover_image ?? null;
  }, [coverImage, post]);

  /* ───────────────────────────── */
  /* MUTATION                      */
  /* ───────────────────────────── */

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => updatePost(secure_id!, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', secure_id] });
      toast.success('Post updated successfully!');
      navigate('/admin/dashboard');
    },

    onError: () => {
      toast.error('Error updating post!');
    },
  });

  /* ───────────────────────────── */
  /* SUBMIT                        */
  /* ───────────────────────────── */

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category_id', data.category_id);
    formData.append('is_published', String(data.is_published));

    if (data.cover_image) {
      formData.append('cover_image', data.cover_image);
    }

    mutate(formData);
  };

  /* ───────────────────────────── */
  /* STATES                        */
  /* ───────────────────────────── */

  if (postLoading) {
    return <div className="py-20 text-center">Loading post...</div>;
  }

  if (postError || !post) {
    return <div className="py-20 text-center">Post not found</div>;
  }

  /* ───────────────────────────── */
  /* UI                            */
  /* ───────────────────────────── */

  return (
    <div className="mx-auto flex max-w-[960px] justify-center px-4 pt-[120px] pb-[60px]">
      <div className="w-full max-w-[600px] rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">Edit Post</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="font-medium">Title</label>
            <input
              {...register('title', { required: true })}
              className="mt-1 w-full rounded-xl border p-3"
            />
          </div>

          {/* Content */}
          <div>
            <label className="font-medium">Content</label>
            <textarea
              {...register('content', { required: true })}
              className="mt-1 h-40 w-full rounded-xl border p-3"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-medium">Category</label>
            <select
              {...register('category_id', { required: true })}
              className="mt-1 w-full rounded-xl border p-3"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.secure_id} value={cat.secure_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Publish */}
          <div className="flex items-center gap-3">
            <input type="checkbox" {...register('is_published')} className="h-5 w-5" />
            <label className="font-medium">Publish this post</label>
          </div>

          {/* Cover image */}
          <div>
            <label className="font-medium">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setValue('cover_image', e.target.files?.[0] ?? null)}
              className="mt-1 w-full rounded-xl border p-3"
            />
          </div>

          {/* Preview */}
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
