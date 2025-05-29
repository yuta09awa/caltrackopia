
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CartConflictDialog from "./CartConflictDialog";

interface CartSheetProps {
  children: React.ReactNode;
}

const CartSheet = ({ children }: CartSheetProps) => {
  const { 
    items, 
    total, 
    itemCount, 
    updateQuantity, 
    removeItem,
    error,
    clearError,
    pendingConflict,
    resolveConflict,
    groupedByLocation
  } = useAppStore();

  const handleConflictReplace = () => {
    resolveConflict('replace');
  };

  const handleConflictCancel = () => {
    resolveConflict('cancel');
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart ({itemCount})
            </SheetTitle>
            <SheetDescription>
              Review your items and proceed to checkout
            </SheetDescription>
          </SheetHeader>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                {error}
                <Button variant="ghost" size="sm" onClick={clearError}>
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6 flex-1 overflow-auto">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedByLocation).map(([locationId, locationItems]) => (
                  <div key={locationId} className="space-y-2">
                    <div className="flex items-center gap-2 px-2 py-1 bg-muted/20 rounded-md">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <h4 className="font-medium text-sm">{locationItems[0].locationName}</h4>
                      <span className="text-xs text-muted-foreground capitalize">
                        ({locationItems[0].locationType})
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {locationItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{item.locationName}</p>
                            <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="border-t border-border pt-4 mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link to="/shopping">View Full Cart</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CartConflictDialog
        isOpen={!!pendingConflict}
        onClose={handleConflictCancel}
        onReplace={handleConflictReplace}
        currentLocationName={pendingConflict?.currentLocationName || ''}
        newLocationName={pendingConflict?.locationName || ''}
        itemName={pendingConflict?.item.name || ''}
      />
    </>
  );
};

export default CartSheet;
