import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPostsByCategory } from '../api/postApi';

export default function CategoryPage() {
  const { secure_id } = useParams();

  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts-by-category', secure_id],
    queryFn: () => getPostsByCategory(secure_id!),
  });

  // Detect category name from one of the posts
  const categoryName = posts[0]?.category?.name || null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pt-28">
      {/* PAGE TITLE */}
      <h1 className="mb-6 text-3xl font-bold">
        Category: <span className="text-blue-600">{categoryName}</span>
      </h1>

      {/* Loading */}
      {isLoading && <p className="text-lg text-gray-500">Loading posts...</p>}

      {/* Error */}
      {error && <p className="text-lg text-red-600">Error fetching posts.</p>}

      {/* No posts */}
      {!isLoading && posts.length === 0 && <p className="text-lg text-gray-500">No posts found.</p>}

      {/* POSTS GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <div
            key={post.secure_id}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow transition-shadow duration-300 hover:shadow-lg"
          >
            {/* IMAGE */}
            {post.image && (
              <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
            )}

            {/* BODY */}
            <div className="flex flex-1 flex-col p-4">
              {/* CATEGORY TAG */}
              {post.category?.name && (
                <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {post.category.name}
                </span>
              )}

              {/* POST TITLE */}
              <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>

              {/* CONTENT SNIPPET */}
              <p className="mb-4 line-clamp-3 text-gray-600">{post.content}</p>

              {/* FOOTER */}
              <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(post.created_at).toLocaleDateString()}</span>

                <Link
                  to={`/post/${post.secure_id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
