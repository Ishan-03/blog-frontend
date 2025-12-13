import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import '../assets/css/Navbar.css';
import reactLogo from '../assets/logo/react.svg';
import { ChevronDown, User, LogIn, UserPlus, LogOut, Search, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories } from '../api/postApi'; // <-- ADD THIS

export default function Navbar() {
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  // 🔥 Load categories dynamically
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Auth context
  const auth = useContext(AuthContext);

  // Logout mutation (unchanged)
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refresh_token = localStorage.getItem('refresh_token');
      if (!refresh_token) return;
      await axiosInstance.post('auth/logout/', { refresh_token });
    },
    onSuccess: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      axiosInstance.defaults.headers['Authorization'] = '';
      auth?.setIsAuthenticated(false);
      queryClient.clear();
      toast.success('You’ve been logged out!');
      navigate('/login');
    },
    onError: () => {
      toast.error('Logout failed!');
    },
  });

  const handleLogout = () => logoutMutation.mutate();

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
    setQuery('');
  };

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  // Close category dropdown
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!auth) return null;
  const { isAuthenticated, isAdmin } = auth;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LEFT LOGO */}
        <div className="flex items-center gap-2">
          <img src={reactLogo} alt="Logo" className="h-10 w-10" />
          <div className="text-2xl">MyBlog</div>
        </div>

        {/* CENTER NAV */}
        <div className="nav-links">
          <Link to="/" className="nav-link">
            {t('nav.home')}
          </Link>

          {/* ✅ CATEGORY DROPDOWN WITH SECURE-ID */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="nav-link flex items-center gap-1"
            >
              {t('nav.category')} <ChevronDown size={18} />
            </button>

            {catOpen && (
              <div className="dropdown-menu">
                {categories?.map((cat: any) => (
                  <Link
                    key={cat.secure_id} // ✔ secure id
                    to={`/category/${cat.secure_id}`} // ✔ secure id route
                    className="dropdown-item"
                    onClick={() => setCatOpen(false)} // close dropdown on click
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className="nav-link">
            {t('nav.about')}
          </Link>
          <Link to="/contact" className="nav-link">
            {t('nav.contact')}
          </Link>
        </div>

        {/* RIGHT SIDE (unchanged) */}
        <div className="nav-right">
          {/* Search */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="search-input rounded-full py-2 pr-3 pl-10"
              />
              <Search size={18} className="absolute top-2.5 left-3 text-gray-500" />
            </div>
          </form>

          {/* Language Selector */}
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="btn-round"
          >
            <option value="en">English</option>
            <option value="si">සිංහල</option>
          </select>

          {/* Auth */}
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="btn-round">
                <User size={16} /> {t('nav.profile')}
              </Link>

              {isAdmin ? (
                <Link to="/admin/dashboard" className="btn-round">
                  <LayoutDashboard size={16} /> {t('nav.dashboard')}
                </Link>
              ) : (
                <Link to="/dashboard" className="btn-round">
                  <LayoutDashboard size={16} /> {t('nav.dashboard')}
                </Link>
              )}

              <button onClick={handleLogout} className="btn-round">
                <LogOut size={16} /> {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-round btn-primary">
                <LogIn size={16} /> {t('nav.signin')}
              </Link>
              <Link to="/register" className="btn-round btn-success">
                <UserPlus size={16} /> {t('nav.signup')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
