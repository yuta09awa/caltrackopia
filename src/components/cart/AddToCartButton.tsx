
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { MenuItem, FeaturedItem } from "@/models/Location";
import { toast } from "sonner";
import { useState } from "react";

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
  const { addItem, items, error, clearError } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const existingItem = items.find(cartItem => cartItem.id === `${locationId}-${item.id}`);
  
  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      clearError(); // Clear any previous errors
      
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
  };

  // Show error toast if there's a cart error
  if (error) {
    toast.error(error);
    clearError();
  }

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={className}
      disabled={isAdding}
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
    </Button>
  );
};

export default AddToCartButton;
