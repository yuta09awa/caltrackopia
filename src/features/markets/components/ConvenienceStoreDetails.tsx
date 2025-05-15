
import StoreSections from "./StoreSections";
import { Market } from "../types";

interface ConvenienceStoreDetailsProps {
  market: Market;
}

const ConvenienceStoreDetails = ({ market }: ConvenienceStoreDetailsProps) => {
  if (!market.sections) {
    return (
      <div className="py-4 px-6 bg-muted rounded-md">
        <p className="text-sm text-muted-foreground">No section information available for this store.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StoreSections sections={market.sections} />
    </div>
  );
};

export default ConvenienceStoreDetails;
