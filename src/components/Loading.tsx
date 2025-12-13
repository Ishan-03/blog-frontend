// src/components/Loading.tsx
export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      {/* Glowing rotating circle */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-ping rounded-full bg-blue-300 opacity-30"></div>
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
      </div>

      {/* Animated loading text */}
      <p className="mt-6 animate-pulse text-lg font-medium text-gray-700">Loading...</p>
    </div>
  );
}
