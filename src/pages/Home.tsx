import '../assets/css/Home.css';
import { useQuery } from '@tanstack/react-query';
import publicApi from '../api/publicApi';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Link } from 'react-router-dom';

// ---------- Types ----------
interface BlogPost {
  id: number;
  secure_id: string;
  title: string;
  content: string;
  slug: string;
  cover_image: string;
  is_published: boolean;
}

interface BlogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
}

export default function Home() {
  const { data, isLoading, error } = useQuery<BlogResponse>({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const res = await publicApi.get('post/');
      return res.data as BlogResponse;
    },
  });

  if (isLoading) return <Loading />;

  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Something went wrong!';
    return <Error message={message} />;
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-title">Welcome to Our Modern App</h1>
        <p className="hero-subtitle">
          Build beautiful web apps with React, React Router, and Tailwind CSS.
        </p>
        <div className="hero-buttons">
          <a href="/about" className="btn-primary">
            Learn More
          </a>
          <a href="/contact" className="btn-secondary">
            Contact Us
          </a>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="blogs-section">
        <h2 className="blogs-title">Latest Blogs</h2>

        <div className="blogs-grid">
          {data?.results
            ?.filter((blog) => blog.is_published) // <-- TS typed
            .map((blog) => (
              <div key={blog.id} className="blog-card">
                <img src={blog.cover_image} alt={blog.title} className="blog-image" />

                <div className="blog-content">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">
                    {blog.content.split(' ').slice(0, 30).join(' ')}...
                  </p>

                  <Link to={`/post/${blog.secure_id}`} className="blog-link">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
