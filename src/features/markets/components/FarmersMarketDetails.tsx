
import { Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VendorList from "./VendorList";
import EventList from "./EventList";
import { Market } from "../types";

interface FarmersMarketDetailsProps {
  market: Market;
}

const FarmersMarketDetails = ({ market }: FarmersMarketDetailsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">About This Market</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule
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
                  <Users className="w-4 h-4" />
                  Vendor Count
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{market.vendorCount} local vendors</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {market.vendors && <VendorList vendors={market.vendors} />}
      
      {market.events && <EventList events={market.events} />}
    </div>
  );
};

export default FarmersMarketDetails;
