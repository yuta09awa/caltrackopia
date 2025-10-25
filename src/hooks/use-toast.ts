
import { toast as sonnerToast, type ToasterProps, type ToastT } from "sonner";
import { logger } from '@/services/logging/LoggingService';

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
    logger.info(`Toast: ${opts}`);
    return sonnerToast(opts);
  }
  
  const { title, description, action, variant = "default" } = opts;
  const logMessage = `Toast (${variant}): ${title || ''} ${description || ''}`.trim();

  // Use the appropriate variant method based on the variant prop
  if (variant === "success") {
    logger.info(logMessage);
    return sonnerToast.success(title, {
      description,
      action,
    });
  }
  
  if (variant === "info") {
    logger.info(logMessage);
    return sonnerToast.info(title, {
      description,
      action,
    });
  }
  
  if (variant === "warning") {
    logger.warn(logMessage);
    return sonnerToast.warning(title, {
      description,
      action,
    });
  }
  
  if (variant === "destructive") {
    logger.error(logMessage);
    return sonnerToast.error(title, {
      description,
      action,
    });
  }

  // Default toast
  logger.info(logMessage);
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
