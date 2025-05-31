
import { Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/models/Location";

interface EventListProps {
  events: Event[];
  title?: string;
}

const EventList = ({ events, title = "Upcoming Events" }: EventListProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      <div className="space-y-3">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{event.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                {event.date}, {event.time}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventList;
