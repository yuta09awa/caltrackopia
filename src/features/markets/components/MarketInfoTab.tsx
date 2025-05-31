
import { Card } from "@/components/ui/card";
import { Location } from "@/models/Location";

interface MarketInfoTabProps {
  market: Location;
}

const MarketInfoTab = ({ market }: MarketInfoTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Address</h3>
        <p className="text-sm text-muted-foreground">{market.address}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Contact</h3>
        <p className="text-sm text-muted-foreground">{market.phone}</p>
        <a 
          href={market.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          {market.website.replace('https://', '')}
        </a>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Hours</h3>
        <div className="text-sm">
          {market.hours.map((hour, idx) => (
            <div 
              key={`${hour.day}-${idx}`}
              className="flex justify-between py-1 border-b border-gray-100 last:border-0"
            >
              <span className={hour.day === "Sunday" ? "font-medium" : ""}>
                {hour.day}
              </span>
              <span className="text-muted-foreground">{hour.hours}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketInfoTab;
