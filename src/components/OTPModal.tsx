import { useState } from 'react';

interface Props {
  email: string;
  onVerify: (otp: string) => void;
  onClose: () => void;
  loading: boolean;
}

export default function OTPModal({ email, onVerify, onClose, loading }: Props) {
  const [otp, setOtp] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="animate-scaleIn w-[90%] max-w-md rounded-2xl border border-white/30 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-1 text-center text-2xl font-bold text-gray-800">Verify OTP</h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          We sent a 6-digit code to <span className="font-semibold">{email}</span>
        </p>

        <input
          type="text"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="mb-6 w-full rounded-xl border border-gray-300 bg-white p-3 text-center text-lg tracking-widest shadow-sm transition-all focus:border-green-500 focus:ring-2 focus:ring-green-300"
        />

        <div className="flex gap-4">
          <button
            onClick={() => onVerify(otp)}
            className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white shadow-md transition-all hover:bg-green-700 active:scale-95 disabled:bg-green-300"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-200 py-3 font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-300 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
