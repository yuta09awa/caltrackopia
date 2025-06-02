
import { useCallback } from 'react';
import { toast } from 'sonner';

let lastToastMessage = '';
let lastToastTime = 0;

export const useToastManager = () => {
  const showSuccessToast = useCallback((message: string) => {
    const now = Date.now();
    if (message !== lastToastMessage || now - lastToastTime > 2000) {
      toast.success(message);
      lastToastMessage = message;
      lastToastTime = now;
    }
  }, []);

  const showInfoToast = useCallback((message: string) => {
    const now = Date.now();
    if (message !== lastToastMessage || now - lastToastTime > 2000) {
      toast.info(message);
      lastToastMessage = message;
      lastToastTime = now;
    }
  }, []);

  const showErrorToast = useCallback((message: string) => {
    const now = Date.now();
    if (message !== lastToastMessage || now - lastToastTime > 2000) {
      toast.error(message);
      lastToastMessage = message;
      lastToastTime = now;
    }
  }, []);

  return {
    showSuccessToast,
    showInfoToast,
    showErrorToast,
  };
};
