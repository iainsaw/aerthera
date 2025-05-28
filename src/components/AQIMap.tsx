
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { WeatherData } from '@/api/openweather';
import { getAqiColor } from '@/api/airvisual';

interface AQIMapProps {
  cities: WeatherData[];
  aqiData: Record<string, number | null>;
}

const AQIMap: React.FC<AQIMapProps> = ({ cities, aqiData }) => {
  // We'll use a combination approach - Folium map embedded via iframe for AQI
  // If the user is searching for multiple cities, we center the map based on the first city
  const centerCity = cities[0];
  const lat = centerCity.coord.lat;
  const lon = centerCity.coord.lon;
  
  // Generate a Folium-style map for AQI via server iframe
  // Note: This uses a public AQI visualization service as a fallback
  // For a real implementation, you'd want to host your own Folium maps
  const foliumMapUrl = `https://waqi.info/map/#lat=${lat}&lng=${lon}&zoom=5`;
  
  // For a more custom solution, we would need a backend that generates Folium maps
  // The URL below accesses a hypothetical API that would generate a Folium map with our data
  // const customFoliumUrl = `https://api.aerthera.com/folium?lat=${lat}&lon=${lon}&cities=${JSON.stringify(cities.map(c => ({ name: c.name, lat: c.coord.lat, lon: c.coord.lon, aqi: aqiData[c.name] })))}`;
  
  return (
    <Card className="w-full h-[600px] weather-card ios-spring-in">
      <CardHeader className="pb-2">
        <CardTitle>Air Quality Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-160px)]">
        <iframe 
          className="w-full h-full border-0 rounded-md ios-fade-in"
          src={foliumMapUrl}
          title="AQI Map"
          loading="lazy"
        />
      </CardContent>
      <CardFooter className="pt-2 flex flex-col items-start">
        <h4 className="text-sm font-medium mb-2">AQI Legend</h4>
        <div className="flex flex-wrap gap-3 ios-fade-in" style={{animationDelay: "0.2s"}}>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-aqi-good mr-1"></div>
            <span className="text-xs">Good (0-50)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-aqi-moderate mr-1"></div>
            <span className="text-xs">Moderate (51-100)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-aqi-sensitive mr-1"></div>
            <span className="text-xs">Sensitive (101-150)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-aqi-unhealthy mr-1"></div>
            <span className="text-xs">Unhealthy (151-200)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-aqi-veryunhealthy mr-1"></div>
            <span className="text-xs">Very Unhealthy (201-300)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-aqi-hazardous mr-1"></div>
            <span className="text-xs">Hazardous (301+)</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 ios-fade-in" style={{animationDelay: "0.3s"}}>
          Data provided by IQAir AirVisual API. Map shows real-time air quality readings.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AQIMap;
