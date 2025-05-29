
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import { ShoppingCart, Trash2, AlertCircle } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CartConflictDialog from "@/components/cart/CartConflictDialog";
import CartItemDisplay from "@/components/cart/CartItemDisplay";
import { useCartOperations } from "@/hooks/useCartOperations";
import { useMemo, useCallback } from "react";

const ShoppingPage = () => {
  const { 
    groupedByLocation,
    pendingConflict,
    resolveConflict
  } = useAppStore();

  const {
    items,
    itemCount,
    formattedTotal,
    totalWithFees,
    formattedTotalWithFees,
    error,
    clearError,
    handleClearCart
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

  if (itemCount === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 pt-24 pb-16">
          <Container>
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
              <p className="text-muted-foreground mb-6">
                Start adding items from restaurants and grocery stores to see them here.
              </p>
              <Button asChild>
                <a href="/map">Browse Locations</a>
              </Button>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 pt-24 pb-16">
          <Container>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
                  <p className="text-muted-foreground">
                    {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
                  </p>
                </div>
                <Button variant="outline" onClick={handleClearCart} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6" role="alert">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  {error}
                  <Button variant="ghost" size="sm" onClick={clearError}>
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6" role="region" aria-label="Cart items">
                {locationEntries.map(([locationId, locationItems]) => (
                  <div key={locationId} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/20">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full" aria-hidden="true"></div>
                        <h3 className="font-medium">{locationItems[0].locationName}</h3>
                        <span className="text-sm text-muted-foreground capitalize">
                          ({locationItems[0].locationType})
                        </span>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-border">
                      {locationItems.map((item) => (
                        <CartItemDisplay key={item.id} item={item} isCompact={false} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-border shadow-sm p-6 sticky top-32" role="region" aria-label="Order summary">
                  <h3 className="font-medium mb-4">Order Summary</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({itemCount} items)</span>
                      <span aria-live="polite">{formattedTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Delivery fee</span>
                      <span>$3.99</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Service fee</span>
                      <span>$1.99</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span aria-live="polite">{formattedTotalWithFees}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </main>
      </div>

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

export default ShoppingPage;
