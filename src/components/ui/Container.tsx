
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Container = ({
  children,
  className,
  as: Component = "div",
  size = "xl",
  ...props
}: ContainerProps) => {
  const maxWidthClass = size === "sm" 
    ? "max-w-screen-sm" 
    : size === "md" 
    ? "max-w-screen-md" 
    : size === "lg" 
    ? "max-w-screen-lg" 
    : "max-w-screen-xl";

  return (
    <Component
      className={cn(
        "mx-auto w-full px-2 sm:px-4",
        maxWidthClass,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
