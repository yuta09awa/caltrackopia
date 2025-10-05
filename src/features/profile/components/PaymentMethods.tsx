
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CreditCard } from "lucide-react";

// Mock payment methods
const mockPaymentMethods = [
  {
    id: "pm-001",
    type: "credit_card",
    brand: "Visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2025,
    isDefault: true
  },
  {
    id: "pm-002",
    type: "credit_card",
    brand: "Mastercard",
    last4: "5555",
    expMonth: 8,
    expYear: 2026,
    isDefault: false
  }
];

const PaymentMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = React.useState(mockPaymentMethods);

  const handleAddPaymentMethod = () => {
    // This would launch a payment method form in a real implementation
    toast({
      title: "Feature coming soon",
      description: "Adding new payment methods will be available when payment processing is integrated."
    });
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    toast({
      title: "Payment method removed",
      description: "The payment method has been removed successfully."
    });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id
      }))
    );
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payment Methods</h3>
        <Button size="sm" onClick={handleAddPaymentMethod}>
          Add New
        </Button>
      </div>
      
      {paymentMethods.length > 0 ? (
        <div className="space-y-3">
          {paymentMethods.map((pm) => (
            <Card key={pm.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {pm.brand} •••• {pm.last4}
                        {pm.isDefault && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {pm.expMonth}/{pm.expYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!pm.isDefault && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetDefault(pm.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemovePaymentMethod(pm.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No payment methods available</p>
          <Button className="mt-4" onClick={handleAddPaymentMethod}>
            Add Payment Method
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
