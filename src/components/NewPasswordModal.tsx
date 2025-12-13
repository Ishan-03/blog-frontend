import { useState } from 'react';

interface Props {
  onSubmit: (pwd: string, cpwd: string) => void;
  onClose: () => void;
  loading: boolean;
}

export default function NewPasswordModal({ onSubmit, onClose, loading }: Props) {
  const [pwd, setPwd] = useState('');
  const [cpwd, setCpwd] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-semibold">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="mb-3 w-full rounded border p-2"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="mb-4 w-full rounded border p-2"
          value={cpwd}
          onChange={(e) => setCpwd(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={() => onSubmit(pwd, cpwd)}
            className="flex-1 rounded bg-green-500 py-2 text-white"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>

          <button onClick={onClose} className="flex-1 rounded bg-gray-200 py-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
