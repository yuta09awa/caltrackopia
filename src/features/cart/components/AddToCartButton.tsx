
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/features/cart";
import { MenuItem, FeaturedItem } from "@/models/Location";
import { toast } from "sonner";
import { useState, useCallback, useMemo } from "react";

interface AddToCartButtonProps {
  item: MenuItem | FeaturedItem;
  locationId: string;
  locationName: string;
  locationType: 'Restaurant' | 'Grocery';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const AddToCartButton = ({ 
  item, 
  locationId, 
  locationName, 
  locationType, 
  variant = 'default',
  size = 'default',
  className 
}: AddToCartButtonProps) => {
  const { addItem, items, error, clearError } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const existingItem = useMemo(() => {
    return items.find(cartItem => cartItem.id === `${locationId}-${item.id}`);
  }, [items, locationId, item.id]);
  
  const handleAddToCart = useCallback(async () => {
    try {
      setIsAdding(true);
      clearError();
      
      // Validate item data before adding
      if (!item.name || !item.price) {
        toast.error("Cannot add item: Missing required information");
        return;
      }
      
      // Check if price is valid
      const priceValue = parseFloat(item.price.replace(/[$,]/g, ''));
      if (isNaN(priceValue) || priceValue < 0) {
        toast.error(`Cannot add ${item.name}: Invalid price format`);
        return;
      }
      
      addItem(item, locationId, locationName, locationType);
      
      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `${item.name} added to cart`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 1000);
      
      // Only show success toast if no error occurred
      if (!error) {
        toast.success(`${item.name} added to cart!`);
      }
    } catch (err) {
      console.error('Error in AddToCartButton:', err);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }, [item, locationId, locationName, locationType, addItem, error, clearError]);

  // Show error toast if there's a cart error
  if (error) {
    toast.error(error);
    clearError();
  }

  const buttonText = useMemo(() => {
    if (isAdding) return "Adding...";
    if (existingItem) return `In Cart (${existingItem.quantity})`;
    return "Add to Cart";
  }, [isAdding, existingItem]);

  const ariaLabel = useMemo(() => {
    if (existingItem) {
      return `${item.name} is in cart with quantity ${existingItem.quantity}. Click to add another.`;
    }
    return `Add ${item.name} to cart`;
  }, [item.name, existingItem]);

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={className}
      disabled={isAdding}
      aria-label={ariaLabel}
      aria-describedby={existingItem ? `cart-status-${item.id}` : undefined}
    >
      {isAdding ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Adding...
        </>
      ) : existingItem ? (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          In Cart ({existingItem.quantity})
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 mr-2" />
          Add to Cart
        </>
      )}
      {existingItem && (
        <span id={`cart-status-${item.id}`} className="sr-only">
          Currently {existingItem.quantity} in cart
        </span>
      )}
    </Button>
  );
};

export default AddToCartButton;
