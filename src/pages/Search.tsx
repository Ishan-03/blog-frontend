// pages/SearchResults.tsx
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchPosts } from '../api/searchApi';

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get('query') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchPosts(query),
    enabled: query.length > 0,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Search results for: <span className="text-blue-600">"{query}"</span>
      </h1>

      {isLoading && <p className="text-lg text-gray-500">Loading posts...</p>}
      {error && <p className="text-lg text-red-600">Error fetching results</p>}

      {data?.results?.length === 0 && <p className="text-lg text-gray-500">No posts found.</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.results?.map((post: any) => (
          <div
            key={post.id}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 shadow transition-shadow duration-300 hover:shadow-lg"
          >
            {post.cover_image && (
              <img src={post.cover_image} alt={post.title} className="h-48 w-full object-cover" />
            )}

            <div className="flex flex-1 flex-col p-4">
              <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
              <p className="mb-4 text-gray-600">
                {post.content.split(' ').slice(0, 30).join(' ')}...
              </p>

              <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                <span>
                  By <strong>{post.author.username}</strong>
                </span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>

              <Link
                to={`/post/${post.slug}`}
                className="mt-4 inline-block font-medium text-blue-600 hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
