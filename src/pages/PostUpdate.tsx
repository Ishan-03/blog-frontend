import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUserPost, updateUserPost, getCategories } from '../api/postApi';
import toast from 'react-hot-toast';

// ─────────────────────────────
// ZOD SCHEMA (FIXED)
// ─────────────────────────────
const PostSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(5, 'Content is required'),
  category_id: z.string().min(1, 'Category is required'),

  // FIXED: allow File | string | null
  cover_image: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
});

type PostFormType = z.infer<typeof PostSchema>;

// ─────────────────────────────
// Types
// ─────────────────────────────
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
  category: Category;
  cover_image?: string | null;
}

export default function UpdatePost() {
  const { secure_id } = useParams<{ secure_id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ─────────────────────────────
  // Fetch Post
  // ─────────────────────────────
  const { data: post, isPending: postPending } = useQuery<Post>({
    queryKey: ['post', secure_id],
    queryFn: () => getUserPost(secure_id as string),
    enabled: !!secure_id,
  });

  // ─────────────────────────────
  // Fetch Categories
  // ─────────────────────────────
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // ─────────────────────────────
  // React Hook Form
  // ─────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<PostFormType>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: '',
      content: '',
      category_id: '',
      cover_image: null,
    },
  });

  // Preview Image Logic
  const coverImage = watch('cover_image');
  const imagePreview =
    typeof coverImage === 'string'
      ? coverImage
      : coverImage instanceof File
        ? URL.createObjectURL(coverImage)
        : null;

  // ─────────────────────────────
  // Sync form with fetched post
  // ─────────────────────────────
  useEffect(() => {
    if (!post) return;

    reset({
      title: post.title,
      content: post.content,
      category_id: String(post.category.id),
      cover_image: post.cover_image || null,
    });
  }, [post, reset]);

  // ─────────────────────────────
  // Mutation (Update Post)
  // ─────────────────────────────
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => updateUserPost(secure_id as string, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', secure_id] });
      toast.success('Post updated successfully!');
      navigate('/dashboard');
    },

    onError: () => {
      toast.error('Error updating post!');
    },
  });

  // ─────────────────────────────
  // Submit Handler (FIXED)
  // ─────────────────────────────
  const onSubmit = (data: PostFormType) => {
    if (!post) return;

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category_id', data.category_id);

    // DO NOT SEND author – backend manages it
    // formData.append('author', post.author.id.toString());

    if (data.cover_image instanceof File) {
      formData.append('cover_image', data.cover_image);
    }

    mutate(formData);
  };

  if (!secure_id) return <div className="py-20 text-center">Invalid Post URL</div>;
  if (postPending) return <div className="py-20 text-center">Loading post...</div>;
  if (!post) return <div className="py-20 text-center">Post not found</div>;

  // ─────────────────────────────
  // UI
  // ─────────────────────────────
  return (
    <div className="mx-auto flex max-w-[960px] justify-center px-4 pt-[120px] pb-[60px]">
      <div className="w-full max-w-[600px] rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">Edit Post</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="font-medium">Title</label>
            <input {...register('title')} className="mt-1 w-full rounded-xl border p-3" />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          {/* Content */}
          <div>
            <label className="font-medium">Content</label>
            <textarea {...register('content')} className="mt-1 h-40 w-full rounded-xl border p-3" />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="font-medium">Category</label>
            <select {...register('category_id')} className="mt-1 w-full rounded-xl border p-3">
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-sm text-red-500">{errors.category_id.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-medium">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full rounded-xl border p-3"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setValue('cover_image', file || null);
              }}
            />
          </div>

          {/* Preview */}
          {imagePreview && (
            <img src={imagePreview} className="mt-3 h-48 w-full rounded-xl object-cover shadow" />
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

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getUserPost, updateUserPost, getCategories } from '../api/postApi';
// import toast from 'react-hot-toast';

// // ───────────────────
// // Types
// // ───────────────────
// interface Author {
//   id: number;
//   username: string;
// }

// interface Category {
//   id: number;
//   name: string;
// }

// interface Post {
//   id: number;
//   title: string;
//   content: string;
//   author: Author;
//   category: Category;
//   cover_image?: string;
// }

// export default function UpdatePost() {
//   const { secure_id } = useParams<{ secure_id: string }>();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // ───────────────────
//   // Fetch Post
//   // ───────────────────
//   const { data: post, isPending: postPending } = useQuery<Post>({
//     queryKey: ['post', secure_id],
//     queryFn: () => getUserPost(secure_id as string),
//     enabled: !!secure_id,
//   });

//   // ───────────────────
//   // Fetch Categories
//   // ───────────────────
//   const { data: categories = [] } = useQuery<Category[]>({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   });

//   // ───────────────────
//   // Form State
//   // ───────────────────
//   // Start empty → populate once with useEffect when post loads
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [categoryId, setCategoryId] = useState<number | null>(null);
//   const [coverImage, setCoverImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   // ───────────────────
//   // Recommended FIX (Sync form state after post loads)
//   // ───────────────────
//   useEffect(() => {
//     if (!post) return;

//     setTitle(post.title);
//     setContent(post.content);
//     setCategoryId(post.category.id);
//     setImagePreview(post.cover_image || null);
//   }, [post]); // runs only once when post becomes available

//   // ───────────────────
//   // Update Mutation
//   // ───────────────────
//   const { mutate, isPending } = useMutation({
//     mutationFn: (formData: FormData) => updateUserPost(secure_id as string, formData),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//       queryClient.invalidateQueries({ queryKey: ['post', secure_id] });
//       toast.success('Post updated successfully!');
//       navigate('/dashboard');
//     },

//     onError: () => {
//       toast.error('Error updating post!');
//     },
//   });

//   // ───────────────────
//   // Image Preview Handler
//   // ───────────────────
//   const handleImageChange = (fileList: FileList | null) => {
//     if (!fileList?.length) {
//       setCoverImage(null);
//       setImagePreview(post?.cover_image || null);
//       return;
//     }

//     const file = fileList[0];
//     setCoverImage(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   // ───────────────────
//   // Submit Handler
//   // ───────────────────
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!post) return;

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('content', content);
//     formData.append('author', post.author.id.toString());
//     formData.append('category_id', String(categoryId));

//     if (coverImage) {
//       formData.append('cover_image', coverImage);
//     }

//     mutate(formData);
//   };

//   // ───────────────────
//   // Early returns for loading/error
//   // ───────────────────
//   if (!secure_id) return <div className="py-20 text-center">Invalid Post URL</div>;
//   if (postPending) return <div className="py-20 text-center">Loading Post...</div>;
//   if (!post) return <div className="py-20 text-center">Post not found</div>;

//   // ───────────────────
//   // UI
//   // ───────────────────
//   return (
//     <div className="mx-auto flex max-w-[960px] justify-center px-4 pt-[120px] pb-[60px]">
//       <div className="w-full max-w-[600px] rounded-2xl bg-white p-6 shadow-lg">
//         <h2 className="mb-6 text-center text-2xl font-semibold">Edit Post</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Title */}
//           <div>
//             <label className="font-medium">Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="mt-1 w-full rounded-xl border p-3"
//               placeholder="Enter post title"
//             />
//           </div>

//           {/* Content */}
//           <div>
//             <label className="font-medium">Content</label>
//             <textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               className="mt-1 h-40 w-full rounded-xl border p-3"
//               placeholder="Write your blog content..."
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label className="font-medium">Category</label>
//             <select
//               value={categoryId ?? ''}
//               onChange={(e) => setCategoryId(Number(e.target.value))}
//               className="mt-1 w-full rounded-xl border p-3"
//             >
//               <option value="" disabled>
//                 Select category
//               </option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Cover Image */}
//           <div>
//             <label className="font-medium">Cover Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleImageChange(e.target.files)}
//               className="mt-1 w-full rounded-xl border p-3"
//             />
//           </div>

//           {/* Preview */}
//           {imagePreview && (
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="mt-3 h-48 w-full rounded-xl object-cover shadow"
//             />
//           )}

//           <button
//             type="submit"
//             disabled={isPending}
//             className="w-full rounded-xl bg-blue-600 py-3 text-lg text-white transition hover:bg-blue-700"
//           >
//             {isPending ? 'Updating...' : 'Update Post'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
