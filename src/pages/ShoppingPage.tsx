import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import { ShoppingCart, Trash2, AlertCircle, Undo2 } from "lucide-react";
import { useAppStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CartItemDisplay from "@/features/cart/components/CartItemDisplay";
import { useCartOperations } from "@/hooks/useCartOperations";
import { useMemo, useCallback, useEffect } from "react";
import CartErrorBoundary from "@/features/cart/components/CartErrorBoundary";
import EnhancedCartConflictDialog from "@/features/cart/components/EnhancedCartConflictDialog";
import { useInternationalization } from "@/hooks/useInternationalization";
import { useCartAnalytics } from "@/hooks/useCartAnalytics";

const ShoppingPage = () => {
  const { 
    groupedByLocation,
    pendingConflict,
    resolveConflict
  } = useAppStore();

  const {
    items,
    itemCount,
    error,
    clearError,
    handleClearCart,
    handleUndo,
    canUndo
  } = useCartOperations();

  const { formatCurrency, calculateTax, getTipSuggestions } = useInternationalization();
  const { trackEvent } = useCartAnalytics();

  const handleConflictReplace = useCallback(() => {
    resolveConflict('replace');
  }, [resolveConflict]);

  const handleConflictCancel = useCallback(() => {
    resolveConflict('cancel');
  }, [resolveConflict]);

  const locationEntries = useMemo(() => {
    return Object.entries(groupedByLocation);
  }, [groupedByLocation]);

  // Add keyboard shortcut for undo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  const tax = useMemo(() => calculateTax(subtotal), [subtotal, calculateTax]);
  const total = useMemo(() => subtotal + tax + 3.99 + 1.99, [subtotal, tax]);

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
    <CartErrorBoundary>
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
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleUndo} 
                    disabled={!canUndo}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Undo2 className="w-4 h-4 mr-2" />
                    Undo
                  </Button>
                  <Button variant="outline" onClick={handleClearCart} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
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
                  <div key={locationId} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
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
                        <CartItemDisplay 
                          key={item.id} 
                          item={item} 
                          isCompact={false} 
                          useQuickSelector={true}
                        />
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
                      <span aria-live="polite">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Delivery fee</span>
                      <span>{formatCurrency(3.99)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Service fee</span>
                      <span>{formatCurrency(1.99)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span aria-live="polite">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => trackEvent('checkout_started', { total, itemCount })}
                  >
                    Proceed to Checkout
                  </Button>

                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>Suggested tips: {getTipSuggestions().map(tip => `${(tip * 100).toFixed(0)}%`).join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </main>
      </div>

      <EnhancedCartConflictDialog
        isOpen={!!pendingConflict}
        onClose={() => resolveConflict('cancel')}
        currentLocationName={pendingConflict?.currentLocationName || ''}
        newLocationName={pendingConflict?.locationName || ''}
        itemName={pendingConflict?.item.name || ''}
      />
    </CartErrorBoundary>
  );
};

export default ShoppingPage;
