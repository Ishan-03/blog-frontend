import { useContext, useState } from 'react';
import '../assets/css/Login.css';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface LoginData {
  email: string;
  password: string;
}

const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; detail?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { setIsAuthenticated } = auth;

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('auth/login/', loginData);
      //console.log(res.data);
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success('OTP sent to your email!');
      setUserId(data.user_id);
      setShowOtpModal(true); // show OTP input modal
    },
    onError: (error: any) => {
      const backendErrors = error.response?.data || {};
      setErrors({ detail: backendErrors.detail || 'Login failed' });
      toast.error('Login failed!');
    },
  });

  //console.log(loginMutation);

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('auth/login-verify-otp/', {
        user_id: userId,
        otp,
      });
      return res.data;
    },
    onSuccess: (data: any) => {
      // Save tokens and user info
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      setIsAuthenticated(true);
      toast.success('Login successful!');
      setShowOtpModal(false);
      setLoginData({ email: '', password: '' });
      setOtp('');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error('Invalid or expired OTP!');
    },
  });

  //console.log(verifyOtpMutation);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: any = {};
    if (!loginData.email) newErrors.email = 'Email is required';
    if (!loginData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    loginMutation.mutate();
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !userId) return;
    verifyOtpMutation.mutate();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login to Your Account</h1>
        <p className="login-subtitle">Enter your credentials to continue</p>

        {errors.detail && <p className="error-text">{errors.detail}</p>}

        <form className="login-form" onSubmit={handleLoginSubmit}>
          {/* EMAIL */}
          <label className="login-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className={`login-input ${errors.email ? 'input-error' : ''}`}
            value={loginData.email}
            onChange={inputHandler}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* PASSWORD */}
          <label className="login-label">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              className={`login-input ${errors.password ? 'input-error' : ''}`}
              value={loginData.password}
              onChange={inputHandler}
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </span>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          <button type="submit" className="login-btn">
            {loginMutation.isPending ? 'Sending OTP...' : 'Login'}
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account?{' '}
          <Link to={'/register'} className="login-link">
            Register
          </Link>
        </p>
        <p className="login-footer">
          Forgotten password?{' '}
          <Link to={'/password-rest'} className="login-link">
            Rest password
          </Link>
        </p>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="otp-modal">
          <div className="otp-card">
            <h2>Enter OTP</h2>
            <p>We sent a 6-digit OTP to your email</p>
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                placeholder="Enter OTP"
                className="login-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="submit" className="login-btn">
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
            <button className="otp-cancel" onClick={() => setShowOtpModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
