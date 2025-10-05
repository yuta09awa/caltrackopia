
import { useCallback, useMemo } from 'react';
import { useAppStore } from '@/app/store';
import { CartItem } from '@/types/cart';

interface UndoAction {
  type: 'remove' | 'clear' | 'quantity';
  itemId?: string;
  item?: CartItem;
  previousQuantity?: number;
  items?: CartItem[];
  timestamp: number;
}

export const useUndoSystem = () => {
  const { 
    items, 
    addItem, 
    updateQuantity, 
    clearCart,
    undoStack,
    addToUndoStack,
    clearUndoStack 
  } = useAppStore();

  const performUndo = useCallback(() => {
    if (undoStack.length === 0) return false;
    
    const lastAction = undoStack[undoStack.length - 1];
    
    switch (lastAction.type) {
      case 'remove':
        if (lastAction.item) {
          const { originalItem, locationId, locationName, locationType } = lastAction.item;
          addItem(originalItem, locationId, locationName, locationType);
          // Set the correct quantity
          setTimeout(() => {
            updateQuantity(lastAction.item!.id, lastAction.item!.quantity);
          }, 0);
        }
        break;
        
      case 'clear':
        if (lastAction.items) {
          // Restore all items
          lastAction.items.forEach(item => {
            const { originalItem, locationId, locationName, locationType } = item;
            addItem(originalItem, locationId, locationName, locationType);
            setTimeout(() => {
              updateQuantity(item.id, item.quantity);
            }, 0);
          });
        }
        break;
        
      case 'quantity':
        if (lastAction.itemId && lastAction.previousQuantity) {
          updateQuantity(lastAction.itemId, lastAction.previousQuantity);
        }
        break;
    }
    
    // Remove the last action from undo stack
    useAppStore.setState(state => ({
      undoStack: state.undoStack.slice(0, -1)
    }));
    
    return true;
  }, [undoStack, addItem, updateQuantity]);

  const canUndo = useMemo(() => undoStack.length > 0, [undoStack.length]);

  const recordRemoveAction = useCallback((item: CartItem) => {
    addToUndoStack({
      type: 'remove',
      itemId: item.id,
      item,
      timestamp: Date.now()
    });
  }, [addToUndoStack]);

  const recordClearAction = useCallback((items: CartItem[]) => {
    addToUndoStack({
      type: 'clear',
      items: [...items],
      timestamp: Date.now()
    });
  }, [addToUndoStack]);

  const recordQuantityAction = useCallback((itemId: string, previousQuantity: number) => {
    addToUndoStack({
      type: 'quantity',
      itemId,
      previousQuantity,
      timestamp: Date.now()
    });
  }, [addToUndoStack]);

  return {
    performUndo,
    canUndo,
    recordRemoveAction,
    recordClearAction,
    recordQuantityAction,
    clearUndoStack
  };
};

export type { UndoAction };
