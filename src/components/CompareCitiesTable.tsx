
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WeatherData } from '@/api/openweather';

interface CompareCitiesTableProps {
  cities: WeatherData[];
  aqiData: Record<string, number | null>;
  uvData: Record<string, number | null>;
}

const CompareCitiesTable: React.FC<CompareCitiesTableProps> = ({ cities, aqiData, uvData }) => {
  if (!cities.length) return null;
  
  return (
    <div className="border border-border/40 rounded-lg overflow-hidden bg-card fade-in">
      <Table>
        <TableCaption>Current weather comparison across selected cities</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-secondary/30">
            <TableHead className="font-medium">City</TableHead>
            <TableHead className="font-medium">Temperature</TableHead>
            <TableHead className="font-medium">Humidity</TableHead>
            <TableHead className="font-medium">Wind Speed</TableHead>
            <TableHead className="font-medium">Pressure</TableHead>
            <TableHead className="font-medium">AQI</TableHead>
            <TableHead className="font-medium">UV Index</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cities.map((city, index) => (
            <TableRow 
              key={city.id} 
              className="hover-lift hover:bg-secondary/20 transition-all duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-medium">{city.name}</TableCell>
              <TableCell>{Math.round(city.main.temp)}°C</TableCell>
              <TableCell>{city.main.humidity}%</TableCell>
              <TableCell>{city.wind.speed} m/s</TableCell>
              <TableCell>{city.main.pressure} hPa</TableCell>
              <TableCell>
                {aqiData[city.name] !== null ? (
                  aqiData[city.name]
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell>
                {uvData[city.name] !== null ? (
                  uvData[city.name]
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompareCitiesTable;
