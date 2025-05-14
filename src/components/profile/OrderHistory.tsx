
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

// Mock order data
const mockOrders = [
  {
    id: "ord-001",
    date: "2025-05-14",
    restaurant: "Pizza Palace",
    items: ["Large Pepperoni Pizza", "Caesar Salad", "Garlic Bread"],
    total: 27.99,
    status: "Delivered"
  },
  {
    id: "ord-002",
    date: "2025-05-10",
    restaurant: "Burger Joint",
    items: ["Double Cheeseburger", "Fries", "Milkshake"],
    total: 19.50,
    status: "Delivered"
  },
  {
    id: "ord-003",
    date: "2025-05-05",
    restaurant: "Sushi House",
    items: ["California Roll", "Miso Soup", "Edamame"],
    total: 32.75,
    status: "Delivered"
  }
];

const OrderHistory: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recent Orders</h3>
      
      {mockOrders.length > 0 ? (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{order.restaurant}</h4>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                    <div className="mt-2">
                      <p className="text-sm">{order.items.join(", ")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {order.status}
                    </span>
                    <p className="mt-2 font-medium">${order.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <button className="text-sm text-primary hover:underline">
                    View details
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No order history available</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
