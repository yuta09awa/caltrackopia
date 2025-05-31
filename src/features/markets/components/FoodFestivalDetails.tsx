
import { Calendar, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VendorList from "./VendorList";
import EventList from "./EventList";
import { Location } from "@/models/Location";

interface FoodFestivalDetailsProps {
  market: Location;
}

const FoodFestivalDetails = ({ market }: FoodFestivalDetailsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Festival Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Festival Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{market.schedule}</p>
                <p className="text-xs text-muted-foreground mt-1">{market.seasonality}</p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Participating Vendors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{market.vendorCount} food & drink vendors</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {market.events && <EventList events={market.events} title="Event Schedule" />}
      
      {market.vendors && <VendorList vendors={market.vendors} />}
    </div>
  );
};

export default FoodFestivalDetails;
