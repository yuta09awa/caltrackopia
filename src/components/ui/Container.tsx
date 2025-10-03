import React from "react";
import { cn } from "@/lib/utils";
import { SPACING } from "@/constants/spacing";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  size?: "sm" | "md" | "lg" | "xl" | "full";
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
    : size === "xl" 
    ? "max-w-screen-xl" 
    : "max-w-none";

  return (
    <Component
      className={cn(
        "mx-auto w-full",
        maxWidthClass,
        className
      )}
      style={{
        paddingLeft: SPACING.container.base,
        paddingRight: SPACING.container.base,
        ...props.style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
