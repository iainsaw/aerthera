
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { WeatherData } from '@/api/openweather';

interface PhotographyAssistantProps {
  weather: WeatherData;
}

const PhotographyAssistant: React.FC<PhotographyAssistantProps> = ({ weather }) => {
  const [goldenHourMorning, setGoldenHourMorning] = useState<string>("");
  const [goldenHourEvening, setGoldenHourEvening] = useState<string>("");
  const [tips, setTips] = useState<string[]>([]);
  
  useEffect(() => {
    // Calculate golden hours based on sunrise and sunset times
    const sunrise = new Date(weather.sys.sunrise * 1000);
    const sunset = new Date(weather.sys.sunset * 1000);
    
    // Morning golden hour starts at sunrise
    const morningGolden = sunrise;
    const eveningGolden = new Date(sunset.getTime() - 60 * 60 * 1000); // 1 hour before sunset
    
    setGoldenHourMorning(morningGolden.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setGoldenHourEvening(eveningGolden.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    // Generate photography tips based on weather condition
    const weatherCondition = weather.weather[0].main;
    const weatherSpecificTips: Record<string, string[]> = {
      'Clear': [
        "Use ND filters for long exposures",
        "Take advantage of long shadows during golden hour",
        "Try shooting silhouettes against the sky"
      ],
      'Clouds': [
        "Perfect for portraits with soft lighting",
        "Experiment with a warmer white balance",
        "Enhance sky details with polarizing filters"
      ],
      'Rain': [
        "Use weather-sealed equipment",
        "Try longer exposures for rain streak effects",
        "Look for reflections on wet surfaces"
      ],
      'Snow': [
        "Overexpose by +1 stop for white snow",
        "Use contrasting colors for subjects",
        "Protect your gear from moisture"
      ],
      'Fog': [
        "Focus on layered compositions",
        "Create moody silhouettes against the fog",
        "Use spot metering for accurate exposure"
      ],
      'Thunderstorm': [
        "Use a tripod for stability in wind",
        "Try to capture lightning with long exposures",
        "Protect your gear with waterproof covers"
      ]
    };
    
    // Set weather-specific tips or default ones
    setTips(weatherSpecificTips[weatherCondition] || [
      "Use a tripod for stability",
      "Experiment with different angles",
      "Consider the rule of thirds for composition"
    ]);
  }, [weather]);
  
  return (
    <Card className="weather-card overflow-hidden ios-spring-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Photography Assistant</CardTitle>
        <Camera className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          <div className="ios-fade-in">
            <p className="text-sm font-medium">Golden Hours</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="weather-metric-card p-2">
                <div className="text-xs text-muted-foreground">Morning</div>
                <div className="text-base font-medium">{goldenHourMorning}</div>
              </div>
              <div className="weather-metric-card p-2">
                <div className="text-xs text-muted-foreground">Evening</div>
                <div className="text-base font-medium">{goldenHourEvening}</div>
              </div>
            </div>
          </div>
          
          <div className="ios-fade-in" style={{animationDelay: "0.1s"}}>
            <p className="text-sm font-medium">Tips for {weather.weather[0].main}</p>
            <ul className="mt-1 space-y-1">
              {tips.map((tip, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start ios-fade-in" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                  <span className="text-primary mr-1">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotographyAssistant;
