
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  fullWidth?: boolean;
}

export const Container = ({
  children,
  className,
  as: Component = "div",
  size = "xl",
  fullWidth = false,
  ...props
}: ContainerProps) => {
  const maxWidthClass = size === "sm" 
    ? "max-w-screen-sm" 
    : size === "md" 
    ? "max-w-screen-md" 
    : size === "lg" 
    ? "max-w-screen-lg" 
    : size === "xl" 
    ? "max-w-screen-xl" 
    : "max-w-none";

  return (
    <Component
      className={cn(
        "mx-auto w-full",
        !fullWidth && "px-4 sm:px-6 md:px-8",
        !fullWidth && maxWidthClass,
        fullWidth && "max-w-none",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
