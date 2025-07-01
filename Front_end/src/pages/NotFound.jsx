import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-120 text-center bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <p className="text-xl mt-2 mb-4">Page Not Found</p>
      <Link
        to="/"
        className="text-white hover:bg-blue-700 bg-blue-500  rounded-xl px-3 py-1"
      >
        Go back home
      </Link>
    </div>
  );
}
