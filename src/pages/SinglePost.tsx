import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axiosInstance from '../api/axiosInstance';
import '../assets/css/SinglePost.css';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  cover_image?: string;
  author: {
    username: string;
    first_name: string | null;
    last_name: string | null;
  };
}

export default function SinglePost() {
  const { secure_id } = useParams<{ secure_id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(`post/${secure_id}/`);
        setPost(res.data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [secure_id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return null;

  // FULL NAME OR USERNAME
  const authorName =
    post.author.first_name && post.author.last_name
      ? `${post.author.first_name} ${post.author.last_name}`
      : post.author.username;

  // FORMATTED DATE
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="single-post-page">
      <div className="single-post-container">
        {post.cover_image && <img src={post.cover_image} alt={post.title} className="post-image" />}

        <h1 className="post-title">{post.title}</h1>

        <div className="post-meta">
          <span>By {authorName}</span> | <span>{formattedDate}</span>
        </div>

        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}
