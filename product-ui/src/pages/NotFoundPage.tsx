import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-400 mb-4" />
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent 
            text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
