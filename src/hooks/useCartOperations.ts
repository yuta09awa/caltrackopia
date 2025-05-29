
import { useCallback, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { useUndoSystem } from './useUndoSystem';
import { useCurrency } from './useCurrency';
import { toast } from 'sonner';

export const useCartOperations = () => {
  const { 
    items, 
    total, 
    itemCount, 
    updateQuantity, 
    removeItem, 
    clearCart,
    error,
    clearError 
  } = useAppStore();

  const { format } = useCurrency();
  const { performUndo, canUndo, recordRemoveAction, recordClearAction } = useUndoSystem();

  const formattedTotal = useMemo(() => format(total), [total, format]);

  const totalWithFees = useMemo(() => {
    const deliveryFee = 3.99;
    const serviceFee = 1.99;
    return total + deliveryFee + serviceFee;
  }, [total]);

  const formattedTotalWithFees = useMemo(() => format(totalWithFees), [totalWithFees, format]);

  const handleClearCart = useCallback(() => {
    const itemsCopy = [...items];
    clearCart();
    
    toast.success('Cart cleared', {
      action: {
        label: "Undo",
        onClick: () => {
          if (performUndo()) {
            toast.success('Cart restored');
          }
        },
      },
    });
  }, [items, clearCart, performUndo]);

  const announceCartUpdate = useCallback((message: string) => {
    // Create a live region announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  const handleQuantityUpdate = useCallback((itemId: string, newQuantity: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    updateQuantity(itemId, newQuantity);
    announceCartUpdate(`${item.name} quantity updated to ${newQuantity}`);
  }, [items, updateQuantity, announceCartUpdate]);

  const handleRemoveItem = useCallback((itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    removeItem(itemId);
    announceCartUpdate(`${item.name} removed from cart`);
    
    toast.success(`${item.name} removed from cart`, {
      action: {
        label: "Undo",
        onClick: () => {
          if (performUndo()) {
            toast.success(`${item.name} restored to cart`);
          }
        },
      },
    });
  }, [items, removeItem, announceCartUpdate, performUndo]);

  const handleUndo = useCallback(() => {
    if (performUndo()) {
      toast.success('Action undone');
    } else {
      toast.error('Nothing to undo');
    }
  }, [performUndo]);

  return {
    items,
    total,
    itemCount,
    formattedTotal,
    totalWithFees,
    formattedTotalWithFees,
    error,
    clearError,
    handleQuantityUpdate,
    handleRemoveItem,
    handleClearCart,
    announceCartUpdate,
    handleUndo,
    canUndo
  };
};
