import { Calendar, Clock, MapPin } from "lucide-react";

interface EventMetadataProps {
  date: string;
  time: string;
  location: string;
}

export function EventMetadata({ date, time, location }: EventMetadataProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Calendar className="size-4" aria-hidden="true" />
        {date}
      </div>
      <div className="flex items-center gap-2">
        <Clock className="size-4" aria-hidden="true" />
        {time}
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="size-4" aria-hidden="true" />
        {location}
      </div>
    </>
  );
}
