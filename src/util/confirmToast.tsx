import toast from 'react-hot-toast';

export function confirmToast(message: string, onConfirm: () => void) {
  toast.custom(
    (t) => (
      <div className="w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
        <p className="text-sm text-gray-800">{message}</p>

        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="rounded-lg bg-red-600 px-3 py-1 text-white hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    ),
    { duration: 5000, position: 'top-center' },
  );
}
