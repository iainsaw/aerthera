
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherData } from '@/api/openweather';
import { MapPinned } from 'lucide-react';

interface WeatherMapProps {
  city: WeatherData;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ city }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create iframe with windy.com map
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.className = 'ios-fade-in';
    
    // Set coordinates based on city data
    const { lat, lon } = city.coord;
    iframe.src = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=650&height=650&zoom=7&level=surface&overlay=wind&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`;
    
    // Clear existing content and append iframe
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = '';
      mapContainerRef.current.appendChild(iframe);
    }
    
    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }
    };
  }, [city]);

  return (
    <Card className="w-full h-[600px] weather-card overflow-hidden ios-spring-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-primary" /> 
            Weather Map for {city.name}
          </CardTitle>
          <div className="text-sm text-muted-foreground flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span> Live
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden rounded-b-xl h-[calc(100%-60px)]">
        <div ref={mapContainerRef} className="w-full h-full rounded-b-xl"></div>
      </CardContent>
    </Card>
  );
};

export default WeatherMap;
