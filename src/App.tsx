import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import './App.css';

import RootLayout from './layouts/RootLayot';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Search from './pages/Search';
import SinglePost from './pages/SinglePost';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import ResetPassword from './pages/ResetPassword';

import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

// Admin pages
import AdminDashboard from './admin/AdminDashboard';
import CreatePostForm from './admin/CreatePost';
import UpdatePostForm from './admin/UpdatePost';
import UpdatePost from './pages/PostUpdate';
import CategoryPage from './pages/CategoryPage';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        {/* -------------------------------------
            PUBLIC ROUTES
        -------------------------------------- */}
        <Route index element={<Home />} />
        <Route path="category/:secure_id" element={<CategoryPage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="post/:secure_id" element={<SinglePost />} />
        <Route path="search" element={<Search />} />
        <Route path="password-rest" element={<ResetPassword />} />

        {/* Login/Register block users IF already logged in */}
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* -------------------------------------
            PRIVATE ROUTES (ANY LOGGED USER)
        -------------------------------------- */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/post/create"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />

        <Route
          path="/post/update/:secure_id"
          element={
            <PrivateRoute>
              <UpdatePost />
            </PrivateRoute>
          }
        />

        {/* -------------------------------------
            ADMIN-ONLY ROUTES
        -------------------------------------- */}
        <Route
          path="admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="admin/post/create"
          element={
            <AdminRoute>
              <CreatePostForm />
            </AdminRoute>
          }
        />

        <Route
          path="admin/post/update/:id"
          element={
            <AdminRoute>
              <UpdatePostForm />
            </AdminRoute>
          }
        />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
