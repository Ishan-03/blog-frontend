import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserPosts, deleteUserPost } from '../api/postApi';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Eye, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import '../assets/css/AdminDashboard.css';
import { confirmToast } from '../util/confirmToast';

// Types
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
  secure_id: string;
  slug: string;
  content: string;
  author: Author;
  category: Category;
  created_at: string;
}

export default function Dashboard() {
  const queryClient = useQueryClient();

  // Fetch posts
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: getUserPosts,
  });

  //console.log(posts);

  // Delete post
  const deleteMutation = useMutation({
    mutationFn: (secure_id: string) => deleteUserPost(secure_id),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['posts'] }); -> It tells React Query: “This data is outdated, please refetch it. ” When you delete a post, your backend updates — but React Query’s cache still has the OLD data.

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully!');
    },
    onError: () => toast.error('Failed to delete post'),
  });

  const handleDelete = (secure_id: string) => {
    confirmToast('Are you sure you want to delete this post?', () => {
      deleteMutation.mutate(secure_id);
    });
  };

  const latestPosts = posts.slice(0, 5);

  if (isLoading) return <div className="pt-24 text-center text-gray-500">Loading...</div>;

  return (
    <div className="dashboard-container space-y-10">
      <h1 className="dashboard-title">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="stats-card">
          <p className="stats-label">Total Posts</p>
          <p className="stats-number">{posts.length}</p>
        </div>

        <div className="stats-card">
          <p className="stats-label">Latest Post</p>
          <p className="mt-2 font-semibold text-gray-900">
            {posts.length ? posts[0].title : 'No posts'}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Latest Posts</h2>

          <Link to="/post/create" className="create-btn">
            <Plus size={18} /> Create New Post
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="table-header">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Created At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {latestPosts.map((post: Post) => (
                <tr className="table-row" key={post.id}>
                  <td className="table-cell">{post.title}</td>
                  <td className="table-cell">{post.author.username}</td>
                  <td className="table-cell">
                    <span className="category-badge">{post.category?.name}</span>
                  </td>
                  <td className="table-cell">{new Date(post.created_at).toLocaleDateString()}</td>

                  {/* Center Action Buttons */}
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/post/${post.secure_id}`} className="action-btn view-btn">
                        <Eye size={16} /> View
                      </Link>

                      <Link to={`/post/update/${post.secure_id}`} className="action-btn edit-btn">
                        <Edit size={16} /> Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(post.secure_id)}
                        className="action-btn delete-btn"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!latestPosts.length && (
                <tr>
                  <td colSpan={5} className="table-cell text-center text-gray-500">
                    No posts available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
