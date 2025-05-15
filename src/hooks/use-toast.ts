
import { toast as sonnerToast, type ToasterProps, type ToastT } from "sonner";

// Define the toast props type for better TypeScript support
export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
}

// Create wrapper for toast to handle variants
export function toast(opts: ToastProps | string) {
  // Handle string case
  if (typeof opts === "string") {
    return sonnerToast(opts);
  }
  
  const { title, description, action, variant = "default" } = opts;

  // Use the appropriate variant method based on the variant prop
  if (variant === "success") {
    return sonnerToast.success(title, {
      description,
      action,
    });
  }
  
  if (variant === "info") {
    return sonnerToast.info(title, {
      description,
      action,
    });
  }
  
  if (variant === "warning") {
    return sonnerToast.warning(title, {
      description,
      action,
    });
  }
  
  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description,
      action,
    });
  }

  // Default toast
  return sonnerToast(title, {
    description,
    action,
  });
}

// Re-export the useToast hook from sonner
export const useToast = () => {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
    error: (title: string, opts?: Omit<ToastProps, "title" | "variant">) => 
      toast({ title, ...opts, variant: "destructive" }),
    success: (title: string, opts?: Omit<ToastProps, "title" | "variant">) => 
      toast({ title, ...opts, variant: "success" }),
    warning: (title: string, opts?: Omit<ToastProps, "title" | "variant">) => 
      toast({ title, ...opts, variant: "warning" }),
    info: (title: string, opts?: Omit<ToastProps, "title" | "variant">) => 
      toast({ title, ...opts, variant: "info" }),
  };
};

// Types
export type { ToasterProps, ToastT };
