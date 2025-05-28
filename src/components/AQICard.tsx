
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAqiColor, getAqiDescription } from '@/api/airvisual';
import { generateAiContent } from '@/api/gemini';
import { Wind } from 'lucide-react';

interface AQICardProps {
  aqi: number | null;
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    conditions: string;
  };
}

const AQICard: React.FC<AQICardProps> = ({ aqi, weather }) => {
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const aqiColor = getAqiColor(aqi);
  const description = getAqiDescription(aqi);

  useEffect(() => {
    const fetchAiAdvice = async () => {
      if (aqi === null) return;
      
      try {
        const result = await generateAiContent("aqiAdvice", {
          weather: {
            coord: { lat: 0, lon: 0 },
            weather: [{ id: 0, main: weather.conditions, description: weather.conditions, icon: '' }],
            base: '',
            main: {
              temp: weather.temperature,
              feels_like: weather.temperature,
              temp_min: weather.temperature,
              temp_max: weather.temperature,
              pressure: 0,
              humidity: weather.humidity
            },
            visibility: 0,
            wind: {
              speed: weather.windSpeed,
              deg: 0
            },
            clouds: { all: 0 },
            dt: 0,
            sys: {
              type: 0,
              id: 0,
              country: '',
              sunrise: 0,
              sunset: 0
            },
            timezone: 0,
            id: 0,
            name: '',
            cod: 0
          },
          aqi
        });
        setAiAdvice(result);
      } catch (error) {
        console.error('Error fetching AI advice:', error);
        setAiAdvice(getDefaultAdvice(aqi));
      } finally {
        setLoading(false);
      }
    };
    
    fetchAiAdvice();
  }, [aqi, weather]);

  const getDefaultAdvice = (aqi: number | null) => {
    if (aqi === null) return "Air quality data unavailable";
    
    if (aqi <= 50) {
      return "Air quality is good. Enjoy outdoor activities.";
    } else if (aqi <= 100) {
      return "Sensitive individuals should consider reducing prolonged outdoor activities.";
    } else if (aqi <= 150) {
      return "Older adults and children should limit prolonged outdoor exertion.";
    } else if (aqi <= 200) {
      return "Everyone may begin to experience health effects.";
    } else if (aqi <= 300) {
      return "Avoid prolonged outdoor activities.";
    } else {
      return "Avoid all outdoor physical activities.";
    }
  };

  if (aqi === null) {
    return (
      <Card className="notion-card overflow-hidden h-full fade-in">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Air Quality</CardTitle>
          <Wind className="h-4 w-4 text-primary opacity-70" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="empty-state py-8">
            <div className="empty-state-icon">🌬️</div>
            <p className="empty-state-text">Air quality data will appear here when available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="notion-card overflow-hidden h-full fade-in hover-lift">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Air Quality</CardTitle>
        <Wind className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-baseline">
            <span 
              className="text-3xl font-bold mr-2 slide-up" 
              style={{ color: aqiColor }}
            >
              {aqi}
            </span>
            <span className="text-sm font-medium text-foreground/80">{description}</span>
          </div>
          
          <div className="aqi-scale mt-3 mb-2">
            <div className="good"></div>
            <div className="moderate"></div>
            <div className="sensitive"></div>
            <div className="unhealthy"></div>
            <div className="very-unhealthy"></div>
            <div className="hazardous"></div>
          </div>
          
          <div 
            className="h-2 rounded-full bg-secondary fade-in" 
            style={{animationDelay: "0.2s"}}
          >
            <div 
              className="h-2 rounded-full" 
              style={{ 
                width: `${Math.min(100, (aqi / 3))}%`,
                backgroundColor: aqiColor,
                transition: "width 1s cubic-bezier(0.65, 0, 0.35, 1)"
              }}
            />
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 fade-in" style={{animationDelay: "0.3s"}}>
            {loading ? getDefaultAdvice(aqi) : aiAdvice}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AQICard;
