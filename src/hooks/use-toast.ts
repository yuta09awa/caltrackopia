
import {
  toast as sonnerToast,
  ToastOptions as SonnerToastOptions,
} from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
} & SonnerToastOptions;

export function toast(props: ToastProps) {
  const { title, description, variant, action, ...options } = props;

  return sonnerToast(title, {
    description,
    action,
    ...options,
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : "",
  });
}

export const useToast = () => {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
    error: (props: ToastProps) => toast({ ...props, variant: "destructive" }),
    success: (props: ToastProps) => toast(props),
  };
};
