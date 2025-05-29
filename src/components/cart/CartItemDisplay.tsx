
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { CartItem } from '@/types/cart';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';

interface CartItemDisplayProps {
  item: CartItem;
  isCompact?: boolean;
}

const CartItemDisplay = React.memo(({ item, isCompact = false }: CartItemDisplayProps) => {
  const { updateQuantity, removeItem } = useAppStore();
  const [optimisticQuantity, setOptimisticQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null);

  // Debounced quantity update
  const debouncedUpdateQuantity = useCallback((newQuantity: number) => {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    setOptimisticQuantity(newQuantity);
    setIsUpdating(true);

    const timeout = setTimeout(() => {
      try {
        updateQuantity(item.id, newQuantity);
        setIsUpdating(false);
      } catch (error) {
        // Rollback optimistic update
        setOptimisticQuantity(item.quantity);
        setIsUpdating(false);
        toast.error('Failed to update quantity. Please try again.');
      }
    }, 500);

    setUpdateTimeout(timeout);
  }, [item.id, item.quantity, updateQuantity, updateTimeout]);

  const handleIncrement = useCallback(() => {
    debouncedUpdateQuantity(optimisticQuantity + 1);
  }, [optimisticQuantity, debouncedUpdateQuantity]);

  const handleDecrement = useCallback(() => {
    if (optimisticQuantity > 1) {
      debouncedUpdateQuantity(optimisticQuantity - 1);
    }
  }, [optimisticQuantity, debouncedUpdateQuantity]);

  const handleRemove = useCallback(() => {
    removeItem(item.id);
    toast.success(`${item.name} removed from cart`, {
      action: {
        label: "Undo",
        onClick: () => {
          // Note: This would require implementing an undo system in the store
          toast.info("Undo functionality coming soon!");
        },
      },
    });
  }, [item.id, item.name, removeItem]);

  const itemTotal = useMemo(() => {
    return (item.price * optimisticQuantity).toFixed(2);
  }, [item.price, optimisticQuantity]);

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(item.price);
  }, [item.price]);

  const formattedTotal = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(itemTotal));
  }, [itemTotal]);

  if (isCompact) {
    return (
      <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-12 h-12 rounded-md object-cover"
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{item.name}</h4>
          <p className="text-xs text-muted-foreground">{item.locationName}</p>
          <p className="text-sm font-medium">{formattedTotal}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={handleDecrement}
            disabled={isUpdating || optimisticQuantity <= 1}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Minus className="w-3 h-3" />}
          </Button>
          <span className="w-6 text-center text-sm" aria-live="polite">
            {optimisticQuantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={handleIncrement}
            disabled={isUpdating}
            aria-label={`Increase quantity of ${item.name}`}
          >
            {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive"
          onClick={handleRemove}
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex items-center gap-4">
      <img 
        src={item.image} 
        alt={item.name}
        className="w-16 h-16 rounded-lg object-cover"
      />
      
      <div className="flex-1">
        <h4 className="font-medium">{item.name}</h4>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        )}
        <div className="flex items-center gap-1 mt-2">
          {item.dietaryTags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrement}
            disabled={isUpdating || optimisticQuantity <= 1}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
          </Button>
          <span className="w-8 text-center font-medium" aria-live="polite">
            {optimisticQuantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrement}
            disabled={isUpdating}
            aria-label={`Increase quantity of ${item.name}`}
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="text-right">
          <p className="font-medium" aria-live="polite">{formattedTotal}</p>
          <p className="text-sm text-muted-foreground">{formattedPrice} each</p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive"
          onClick={handleRemove}
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

CartItemDisplay.displayName = 'CartItemDisplay';

export default CartItemDisplay;
