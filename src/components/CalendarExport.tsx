
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { WeatherData } from '@/api/openweather';
import { getCalendarEvent } from '@/utils/weatherUtils';
import { format } from 'date-fns';

interface CalendarExportProps {
  weather: WeatherData;
}

const CalendarExport: React.FC<CalendarExportProps> = ({ weather }) => {
  const [date, setDate] = useState<Date>(new Date());

  const handleDownload = () => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const event = getCalendarEvent(weather, formattedDate);
    
    // Create downloadable link
    const blob = new Blob([event], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather_${weather.name}_${formattedDate}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Add to Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button onClick={handleDownload} className="w-full">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Download Calendar Event
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Creates a calendar event with current weather conditions for {weather.name}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarExport;
