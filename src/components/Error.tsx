// src/components/Error.tsx
interface ErrorProps {
  message: string;
}

export default function Error({ message }: ErrorProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4">
      {/* Animated warning icon */}
      <div className="mb-6 flex space-x-2">
        <div className="h-4 w-4 animate-bounce rounded-full bg-red-500 delay-150"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-red-500 delay-300"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-red-500 delay-450"></div>
      </div>

      <div className="max-w-sm rounded border-l-4 border-red-500 bg-red-100 p-4 text-center shadow-md">
        <p className="text-lg font-bold text-red-700">Error</p>
        <p className="mt-2 text-red-700">{message}</p>
      </div>
    </div>
  );
}
