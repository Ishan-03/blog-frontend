import React, { useState } from 'react';
import '../assets/css/Register.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterData>({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
  });

  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // ---------------- Input Handler ----------------
  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- Register Mutation ----------------
  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('auth/register/', formData);
      return res.data;
    },

    onSuccess: () => {
      toast.success('Check your email for OTP!');
      setShowOtpModal(true);
    },

    onError: (error: any) => {
      const backendErrors = error.response?.data || {};
      setErrors(backendErrors);
      toast.error('Registration failed');
    },
  });

  // ---------------- OTP Verify Mutation ----------------
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('auth/verify-email/', {
        email: formData.email,
        code: otp,
      });
      return res.data;
    },

    onSuccess: () => {
      toast.success('Account Verified! 🎉');
      setShowOtpModal(false);
      navigate('/login');
    },

    onError: () => {
      toast.error('Invalid OTP');
    },
  });

  // ---------------- Validation ----------------
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = 'Passwords do not match';
    return newErrors;
  };

  // ---------------- Submit ----------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    registerMutation.mutate();
  };

  return (
    <>
      {/* ============ MAIN PAGE ============ */}
      <div className="register-container">
        <div className="register-card">
          <h1 className="register-title">Create Your Account</h1>
          <p className="register-subtitle">Fill in the details to get started</p>

          <form className="register-form" onSubmit={handleSubmit}>
            {/* First Name */}
            <label className="register-label">First Name</label>
            <input
              name="first_name"
              className={`register-input ${errors.first_name ? 'input-error' : ''}`}
              value={formData.first_name}
              onChange={inputHandler}
            />
            {errors.first_name && <p className="error-text">{errors.first_name}</p>}

            {/* Last Name */}
            <label className="register-label">Last Name</label>
            <input
              name="last_name"
              className={`register-input ${errors.last_name ? 'input-error' : ''}`}
              value={formData.last_name}
              onChange={inputHandler}
            />
            {errors.last_name && <p className="error-text">{errors.last_name}</p>}

            {/* Username */}
            <label className="register-label">Username</label>
            <input
              name="username"
              className={`register-input ${errors.username ? 'input-error' : ''}`}
              value={formData.username}
              onChange={inputHandler}
            />
            {errors.username && <p className="error-text">{errors.username}</p>}

            {/* Email */}
            <label className="register-label">Email</label>
            <input
              type="email"
              name="email"
              className={`register-input ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={inputHandler}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}

            {/* Password */}
            <label className="register-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`register-input ${errors.password ? 'input-error' : ''}`}
                value={formData.password}
                onChange={inputHandler}
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}

            {/* Confirm Password */}
            <label className="register-label">Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                className={`register-input ${errors.confirm_password ? 'input-error' : ''}`}
                value={formData.confirm_password}
                onChange={inputHandler}
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            {errors.confirm_password && <p className="error-text">{errors.confirm_password}</p>}

            <button type="submit" className="register-btn">
              {registerMutation.isPending ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="register-footer">
            Already have an account?
            <Link to="/login" className="register-link">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* ============ OTP POPUP MODAL ============ */}
      {showOtpModal && (
        <div className="otp-modal-backdrop">
          <div className="otp-modal-card">
            <h2 className="otp-modal-title">Verify Your Email</h2>
            <p className="otp-modal-subtitle">
              Enter the 6-digit code we sent to{' '}
              <span className="otp-modal-email">{formData.email}</span>
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              className="otp-modal-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={() => verifyOtpMutation.mutate()} className="otp-modal-btn">
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button className="otp-modal-cancel" onClick={() => setShowOtpModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// import React, { useState } from 'react';
// import '../assets/css/Register.css';
// import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
// import { useMutation } from '@tanstack/react-query';
// import axiosInstance from '../api/axiosInstance';
// import { useNavigate, Link } from 'react-router-dom';
// import toast from 'react-hot-toast';

// interface RegisterData {
//   first_name: string;
//   last_name: string;
//   email: string;
//   username: string;
//   password: string;
//   confirm_password: string;
// }

// export default function Register() {
//   const [formData, setFormData] = useState<RegisterData>({
//     first_name: '',
//     last_name: '',
//     email: '',
//     username: '',
//     password: '',
//     confirm_password: '',
//   });

//   const [errors, setErrors] = useState<any>({}); // validation + backend errors

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const navigate = useNavigate();

//   const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const togglePassword = () => setShowPassword(!showPassword);
//   const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

//   // ---------------- Mutation ----------------
//   const mutation = useMutation({
//     mutationFn: async () => {
//       const res = await axiosInstance.post('auth/register/', formData);
//       return res.data;
//     },

//     onSuccess: (data) => {
//       //console.log(data);
//       navigate('/login');
//       toast.success('Registration successfull! 🎉');
//       setFormData({
//         first_name: '',
//         last_name: '',
//         email: '',
//         username: '',
//         password: '',
//         confirm_password: '',
//       });
//       setErrors({});
//     },

//     onError: (error: any) => {
//       const backendErrors = error.response?.data || {};
//       setErrors(backendErrors);

//       //const message = Object.values(backendErrors).flat().join(', ');

//       toast.error('Registration failed!');
//     },
//   });

//   // ---------------- Frontend Validation ----------------
//   const validateForm = () => {
//     let newErrors: any = {};

//     if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';

//     if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';

//     if (!formData.email.trim()) newErrors.email = 'Email is required';

//     if (!formData.username.trim()) newErrors.username = 'Username is required';

//     if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

//     if (formData.password !== formData.confirm_password)
//       newErrors.confirm_password = 'Passwords do not match';

//     return newErrors;
//   };

//   // ---------------- Submit ----------------
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setErrors({});
//     mutation.mutate();
//   };

//   return (
//     <div className="register-container">
//       <div className="register-card">
//         <h1 className="register-title">Create Your Account</h1>
//         <p className="register-subtitle">Fill in the details to get started</p>

//         <form className="register-form" onSubmit={handleSubmit}>
//           {/* ---------- First Name ---------- */}
//           <label className="register-label">First Name</label>
//           <input
//             type="text"
//             name="first_name"
//             placeholder="John"
//             className={`register-input ${errors.first_name ? 'input-error' : ''}`}
//             value={formData.first_name}
//             onChange={inputHandler}
//           />
//           {errors.first_name && <p className="error-text">{errors.first_name}</p>}

//           {/* ---------- Last Name ---------- */}
//           <label className="register-label">Last Name</label>
//           <input
//             type="text"
//             name="last_name"
//             placeholder="Doe"
//             className={`register-input ${errors.last_name ? 'input-error' : ''}`}
//             value={formData.last_name}
//             onChange={inputHandler}
//           />
//           {errors.last_name && <p className="error-text">{errors.last_name}</p>}

//           {/* ---------- Username ---------- */}
//           <label className="register-label">Username</label>
//           <input
//             type="text"
//             name="username"
//             placeholder="johndoe123"
//             className={`register-input ${errors.username ? 'input-error' : ''}`}
//             value={formData.username}
//             onChange={inputHandler}
//             autoComplete="username"
//           />
//           {errors.username && <p className="error-text">{errors.username}</p>}

//           {/* ---------- Email ---------- */}
//           <label className="register-label">Email</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="you@example.com"
//             className={`register-input ${errors.email ? 'input-error' : ''}`}
//             value={formData.email}
//             onChange={inputHandler}
//           />
//           {errors.email && <p className="error-text">{errors.email}</p>}

//           {/* ---------- Password ---------- */}
//           <label className="register-label">Password</label>
//           <div className="password-wrapper">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               placeholder="********"
//               className={`register-input ${errors.password ? 'input-error' : ''}`}
//               value={formData.password}
//               onChange={inputHandler}
//               autoComplete="new-password"
//             />
//             <span className="password-toggle" onClick={togglePassword}>
//               {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//             </span>
//           </div>
//           {errors.password && <p className="error-text">{errors.password}</p>}

//           {/* ---------- Confirm Password ---------- */}
//           <label className="register-label">Confirm Password</label>
//           <div className="password-wrapper">
//             <input
//               type={showConfirmPassword ? 'text' : 'password'}
//               name="confirm_password"
//               placeholder="********"
//               className={`register-input ${errors.confirm_password ? 'input-error' : ''}`}
//               value={formData.confirm_password}
//               onChange={inputHandler}
//               autoComplete="new-password"
//             />
//             <span className="password-toggle" onClick={toggleConfirmPassword}>
//               {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//             </span>
//           </div>
//           {errors.confirm_password && <p className="error-text">{errors.confirm_password}</p>}

//           {/* ---------- Submit ---------- */}
//           <button type="submit" className="register-btn">
//             {mutation.isPending ? 'Registering...' : 'Register'}
//           </button>
//         </form>

//         <p className="register-footer">
//           Already have an account?{' '}
//           <Link to={'/login'} className="register-link">
//             Login
//           </Link>
//           {/* <a href="/login" className="register-link">
//             Login
//           </a> */}
//         </p>
//       </div>
//     </div>
//   );
// }
