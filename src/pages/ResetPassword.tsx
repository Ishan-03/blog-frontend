import { useState } from 'react';
import { sendOTP, resetPassword } from '../api/pwAuthApi';
import OTPModal from '../components/OTPModal';
import NewPasswordModal from '../components/NewPasswordModal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otpModal, setOtpModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedOTP, setSavedOTP] = useState('');

  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      await sendOTP(email);
      toast.success('OTP sent to email');
      setOtpModal(true);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      setSavedOTP(otp);
      setOtpModal(false);
      setPasswordModal(true);
    } catch {
      toast.error('Invalid OTP');
    }
  };

  const handleReset = async (pwd: string, cpwd: string) => {
    if (pwd !== cpwd) return toast.error('Passwords do not match');

    try {
      setLoading(true);
      await resetPassword(email, pwd, cpwd, savedOTP);
      toast.success('Password reset successful');
      setPasswordModal(false);
      navigate('/login');
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-5">
      <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/70 p-8 shadow-xl backdrop-blur-md">
        <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-800">Reset Password</h1>

        <label className="mb-1 block text-sm font-medium text-gray-600">Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="mb-6 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm transition-all focus:border-green-500 focus:ring-2 focus:ring-green-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSendOTP}
          className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white shadow-md transition-all hover:bg-green-700 active:scale-95 disabled:bg-green-300"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>

        {otpModal && (
          <OTPModal
            email={email}
            onVerify={handleVerifyOTP}
            loading={loading}
            onClose={() => setOtpModal(false)}
          />
        )}

        {passwordModal && (
          <NewPasswordModal
            onSubmit={handleReset}
            onClose={() => setPasswordModal(false)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
