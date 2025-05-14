
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right" 
      toastOptions={{
        classNames: {
          toast: "group border bg-background text-foreground",
          error: "group border-destructive bg-destructive text-destructive-foreground",
          success: "group border-green-500 bg-green-500 text-white",
          warning: "group border-yellow-500 bg-yellow-500 text-white",
          info: "group border-blue-500 bg-blue-500 text-white",
        }
      }}
    />
  );
}
