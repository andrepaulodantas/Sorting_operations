import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`container mx-auto px-4 py-8 max-w-7xl ${className}`}>
      {children}
    </div>
  );
};
