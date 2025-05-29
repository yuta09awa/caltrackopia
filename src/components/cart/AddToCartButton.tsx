
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { MenuItem, FeaturedItem } from "@/models/Location";
import { toast } from "sonner";

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
  const { addItem, items } = useAppStore();
  
  const existingItem = items.find(cartItem => cartItem.id === `${locationId}-${item.id}`);
  
  const handleAddToCart = () => {
    addItem(item, locationId, locationName, locationType);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={className}
    >
      {existingItem ? (
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
