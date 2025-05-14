
import {
  toast as sonnerToast,
  type ToastT,
} from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
}

export function toast(props: ToastProps) {
  const { title, description, variant, action, ...options } = props;

  // Map variants to appropriate class names
  let className = "";
  if (variant === "destructive") {
    className = "bg-destructive text-destructive-foreground";
  } else if (variant === "success") {
    className = "border-green-500 bg-green-500 text-white";
  } else if (variant === "warning") {
    className = "border-yellow-500 bg-yellow-500 text-white";
  } else if (variant === "info") {
    className = "border-blue-500 bg-blue-500 text-white";
  }

  return sonnerToast(title, {
    description,
    action,
    ...options,
    className,
  });
}

export const useToast = () => {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
    error: (props: ToastProps) => toast({ ...props, variant: "destructive" }),
    success: (props: ToastProps) => toast({ ...props, variant: "success" }),
    warning: (props: ToastProps) => toast({ ...props, variant: "warning" }),
    info: (props: ToastProps) => toast({ ...props, variant: "info" }),
  };
};
