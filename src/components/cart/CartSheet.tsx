
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
import { ShoppingCart, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CartConflictDialog from "./CartConflictDialog";
import CartItemDisplay from "./CartItemDisplay";
import { useCartOperations } from "@/hooks/useCartOperations";
import { useMemo, useCallback } from "react";

interface CartSheetProps {
  children: React.ReactNode;
}

const CartSheet = ({ children }: CartSheetProps) => {
  const { 
    groupedByLocation,
    pendingConflict,
    resolveConflict,
  } = useAppStore();
  
  const {
    items,
    itemCount,
    formattedTotal,
    error,
    clearError
  } = useCartOperations();

  const handleConflictReplace = useCallback(() => {
    resolveConflict('replace');
  }, [resolveConflict]);

  const handleConflictCancel = useCallback(() => {
    resolveConflict('cancel');
  }, [resolveConflict]);

  const locationEntries = useMemo(() => {
    return Object.entries(groupedByLocation);
  }, [groupedByLocation]);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]" role="dialog" aria-labelledby="cart-title">
          <SheetHeader>
            <SheetTitle id="cart-title" className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart ({itemCount})
            </SheetTitle>
            <SheetDescription>
              Review your items and proceed to checkout
            </SheetDescription>
          </SheetHeader>
          
          {error && (
            <Alert variant="destructive" className="mt-4" role="alert">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                {error}
                <Button variant="ghost" size="sm" onClick={clearError}>
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6 flex-1 overflow-auto" role="region" aria-label="Cart items">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-6">
                {locationEntries.map(([locationId, locationItems]) => (
                  <div key={locationId} className="space-y-2" role="group" aria-label={`Items from ${locationItems[0].locationName}`}>
                    <div className="flex items-center gap-2 px-2 py-1 bg-muted/20 rounded-md">
                      <div className="w-2 h-2 bg-primary rounded-full" aria-hidden="true"></div>
                      <h4 className="font-medium text-sm">{locationItems[0].locationName}</h4>
                      <span className="text-xs text-muted-foreground capitalize">
                        ({locationItems[0].locationType})
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {locationItems.map((item) => (
                        <CartItemDisplay key={item.id} item={item} isCompact={true} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="border-t border-border pt-4 mt-6" role="region" aria-label="Cart summary">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg" aria-live="polite">{formattedTotal}</span>
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
