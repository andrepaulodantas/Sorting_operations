import React from "react";
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  message = "Loading...",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <Loader
        className={`${sizeClasses[size]} text-primary-500 animate-spin`}
      />
      <p className="mt-4 text-gray-400 text-sm font-medium">{message}</p>
    </div>
  );
};
