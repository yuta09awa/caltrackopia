
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Location } from "@/models/Location";

interface GenericMarketDetailsProps {
  market: Location;
}

const GenericMarketDetails = ({ market }: GenericMarketDetailsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Available Products</h3>
        <div className="grid grid-cols-2 gap-3">
          {market.dietaryOptions.map((option, idx) => (
            <Card key={idx}>
              <CardHeader className="p-3">
                <CardTitle className="text-sm">{option}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenericMarketDetails;
