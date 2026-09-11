import React from "react";

interface TableActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.FC<{ className?: string }>;
  title: string;
  variant?: "primary" | "constructive" | "destructive" | "normal";
}

export const TableActionButton: React.FC<TableActionButtonProps> = ({ 
  icon: Icon, 
  title, 
  variant = "normal", 
  className = "", 
  disabled,
  ...props 
}) => {
  let colorStyles = "text-slate-600 hover:text-blue-700 hover:bg-blue-50";
  
  if (variant === "constructive" || variant === "primary") {
    colorStyles = "text-blue-600 hover:text-blue-800 hover:bg-blue-50";
  } else if (variant === "destructive") {
    colorStyles = "text-red-500 hover:text-red-700 hover:bg-red-50";
  }

  if (disabled) {
    colorStyles = "text-slate-400 opacity-60 cursor-not-allowed";
  }

  return (
    <button
      title={title}
      aria-label={title}
      disabled={disabled}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${colorStyles} ${className}`}
      {...props}
    >
      <Icon className="w-[18px] h-[18px]" />
    </button>
  );
};
