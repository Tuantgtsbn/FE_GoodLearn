import React from 'react';

interface ErrorMessageProps {
  message?: React.ReactNode;
  className?: string;
}

export default function ErrorMessage({
  message,
  className,
}: ErrorMessageProps) {
  return (
    <div>
      <p className={`text-red-500 ${className}`}>{message}</p>
    </div>
  );
}
