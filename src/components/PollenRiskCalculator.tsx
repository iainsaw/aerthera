
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherData } from '@/api/openweather';
import { Flower } from 'lucide-react';

interface PollenRiskCalculatorProps {
  weather: WeatherData;
}

const PollenRiskCalculator: React.FC<PollenRiskCalculatorProps> = ({ weather }) => {
  const [pollenLevel, setPollenLevel] = useState<number>(0);
  const [pollenTypes, setPollenTypes] = useState<string[]>([]);
  
  useEffect(() => {
    // Calculate pollen level based on humidity, wind speed, and temperature
    const { humidity } = weather.main;
    const { speed: windSpeed } = weather.wind;
    const temp = weather.main.temp;
    
    // Calculate pollen level (0-5 scale)
    // Lower humidity and higher wind speeds generally mean higher pollen levels
    const calculatedPollenLevel = Math.max(0, Math.min(5, (100 - humidity)/15 + windSpeed/2));
    setPollenLevel(calculatedPollenLevel);
    
    // Determine which pollen types are likely based on current month and conditions
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    const potentialPollenTypes = [
      { 
        name: "Tree Pollen", 
        active: [3, 4, 5], // March to May
        conditions: { minTemp: 5, maxTemp: 25, minHumidity: 0, maxHumidity: 80 }
      },
      { 
        name: "Grass Pollen", 
        active: [5, 6, 7, 8], // May to August
        conditions: { minTemp: 10, maxTemp: 35, minHumidity: 0, maxHumidity: 70 }
      },
      { 
        name: "Weed Pollen", 
        active: [8, 9, 10], // August to October
        conditions: { minTemp: 15, maxTemp: 40, minHumidity: 0, maxHumidity: 60 }
      },
      { 
        name: "Mold Spores", 
        active: [6, 7, 8, 9], // June to September
        conditions: { minTemp: 20, maxTemp: 50, minHumidity: 70, maxHumidity: 100 }
      }
    ];
    
    const activeTypes = potentialPollenTypes.filter(type => {
      return type.active.includes(currentMonth) && 
             temp >= type.conditions.minTemp && 
             temp <= type.conditions.maxTemp &&
             humidity >= type.conditions.minHumidity &&
             humidity <= type.conditions.maxHumidity;
    }).map(type => type.name);
    
    setPollenTypes(activeTypes);
  }, [weather]);
  
  const getPollenRecommendation = (level: number): string => {
    if (level < 1) return "Safe for outdoor activities";
    if (level < 2) return "Low risk, stay alert";
    if (level < 3) return "Consider mask if sensitive";
    if (level < 4) return "Avoid dense vegetation areas";
    if (level < 5) return "High risk, limit outdoor activities";
    return "Danger! Allergy sufferers should stay indoors";
  };
  
  return (
    <Card className="weather-card overflow-hidden ios-spring-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Pollen Risk</CardTitle>
        <Flower className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold mr-2 ios-scale-in">{pollenLevel.toFixed(1)}</span>
            <span className="text-sm font-medium">out of 5.0</span>
          </div>
          
          <div className="w-full bg-secondary h-2 rounded-full ios-fade-in" style={{animationDelay: "0.1s"}}>
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-lime-400 via-amber-400 to-red-500" 
              style={{ width: `${Math.min(100, pollenLevel * 20)}%`, transition: "width 1s ease-out" }}
            />
          </div>
          
          <div className="pt-2 ios-fade-in" style={{animationDelay: "0.2s"}}>
            <p className="text-sm font-medium">{getPollenRecommendation(pollenLevel)}</p>
          </div>
          
          {pollenTypes.length > 0 && (
            <div className="pt-1 ios-fade-in" style={{animationDelay: "0.3s"}}>
              <p className="text-xs text-muted-foreground mb-1">Predominant Pollen Types:</p>
              <div className="flex flex-wrap gap-2">
                {pollenTypes.map((type, index) => (
                  <div key={index} className="px-2 py-1 bg-secondary/80 rounded-full text-xs">
                    {type}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {pollenTypes.length === 0 && (
            <p className="text-xs text-muted-foreground ios-fade-in" style={{animationDelay: "0.3s"}}>
              No significant pollen activity detected
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PollenRiskCalculator;
