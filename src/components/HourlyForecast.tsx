
import React from 'react';
import { ForecastData } from '@/api/openweather';
import { formatTime } from '@/utils/dateUtils';
import { Card, CardContent } from '@/components/ui/card';

interface HourlyForecastProps {
  forecastData: ForecastData;
  hours?: number;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecastData, hours = 8 }) => {
  // Only get the specified number of hours
  const hourlyData = forecastData.list.slice(0, hours);
  
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 pt-1 px-0.5 -mx-1">
      {hourlyData.map((hour, index) => (
        <Card 
          key={hour.dt} 
          className={`notion-metric-card hover-lift shrink-0 w-[86px] fade-in`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-3 flex flex-col items-center">
            <div className="text-xs font-medium text-foreground/80">
              {formatTime(hour.dt)}
            </div>
            <img 
              src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} 
              alt={hour.weather[0].description}
              className="w-12 h-12 my-1"
            />
            <div className="text-base font-bold">{Math.round(hour.main.temp)}°C</div>
            <div className="text-xs text-muted-foreground mt-1">
              {hour.main.humidity}%
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HourlyForecast;
