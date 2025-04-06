
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: number;
  className?: string;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 24, 
  className,
  text = "Loading..." 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-4", className)}>
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
      {text && <p className="text-sm text-muted-foreground mt-2">{text}</p>}
    </div>
  );
};

export const PageLoading = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
    <Loading size={32} />
  </div>
);
