
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Vendor } from "../types";

interface VendorListProps {
  vendors: Vendor[];
}

const VendorList = ({ vendors }: VendorListProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Featured Vendors</h3>
      <div className="space-y-3">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/4 h-24 sm:h-auto">
                <img 
                  src={vendor.images[0]} 
                  alt={vendor.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{vendor.name}</h4>
                  <Badge variant="outline">{vendor.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{vendor.description}</p>
                <div className="mt-2">
                  <p className="text-xs font-medium">Popular Items</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {vendor.popular.map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorList;
