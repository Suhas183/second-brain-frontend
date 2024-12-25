import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-black text-white">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-6xl font-extrabold tracking-tighter sm:text-7xl transition-transform hover:scale-110">
            404
          </h1>
          <p className="text-gray-400">
            Oops! You've ventured into the void. Let's head back to safety.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex h-10 items-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-transform hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
