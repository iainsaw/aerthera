
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUvIndexColor, getUvIndexDescription } from '@/api/openmeteo';
import { generateAiContent } from '@/api/gemini';
import { Sun } from 'lucide-react';

interface UVCardProps {
  uvIndex: number | null;
}

const UVCard: React.FC<UVCardProps> = ({ uvIndex }) => {
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const uvColor = getUvIndexColor(uvIndex);
  const description = getUvIndexDescription(uvIndex);

  useEffect(() => {
    const fetchAiAdvice = async () => {
      if (uvIndex === null) return;
      
      try {
        const result = await generateAiContent("uvAdvice", {
          weather: {
            coord: { lat: 0, lon: 0 },
            weather: [{ id: 0, main: '', description: '', icon: '' }],
            base: '',
            main: {
              temp: 0,
              feels_like: 0,
              temp_min: 0,
              temp_max: 0,
              pressure: 0,
              humidity: 0
            },
            visibility: 0,
            wind: { speed: 0, deg: 0 },
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
          uvIndex: uvIndex
        });
        setAiAdvice(result);
      } catch (error) {
        console.error('Error fetching UV advice:', error);
        setAiAdvice(getDefaultAdvice(uvIndex));
      } finally {
        setLoading(false);
      }
    };
    
    fetchAiAdvice();
  }, [uvIndex]);

  const getDefaultAdvice = (uvIndex: number | null) => {
    if (uvIndex === null) return "UV data unavailable";
    
    if (uvIndex <= 2) {
      return "No protection needed. Safe for outside activities.";
    } else if (uvIndex <= 5) {
      return "Wear SPF 30+ and seek shade during midday.";
    } else if (uvIndex <= 7) {
      return "Limit sun exposure between 10am-4pm.";
    } else if (uvIndex <= 10) {
      return "Minimize exposure and reapply sunscreen.";
    } else {
      return "Avoid sun exposure when possible.";
    }
  };

  // Calculate percentage for the UV scale (0-12)
  const uvPercentage = uvIndex !== null ? Math.min(100, (uvIndex / 12) * 100) : 0;

  if (uvIndex === null) {
    return (
      <Card className="notion-card overflow-hidden h-full fade-in">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">UV Index</CardTitle>
          <Sun className="h-4 w-4 text-primary opacity-70" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="empty-state py-8">
            <div className="empty-state-icon">☀️</div>
            <p className="empty-state-text">UV index data is not available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="notion-card overflow-hidden h-full fade-in hover-lift">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">UV Index</CardTitle>
        <Sun className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-baseline">
            <span 
              className="text-3xl font-bold mr-2 slide-up" 
              style={{ color: uvColor }}
            >
              {uvIndex}
            </span>
            <span className="text-sm font-medium text-foreground/80">{description}</span>
          </div>
          
          <div className="mt-3 mb-1 h-2 fade-in relative" style={{animationDelay: "0.1s"}}>
            <div className="w-full h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 opacity-80 relative">
              <div className="absolute top-0 slide-up" style={{
                left: `calc(${uvPercentage}% - 6px)`, 
                transition: "left 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                animationDelay: "0.3s"
              }}>
                <div className="w-3 h-3 bg-white rounded-full shadow-md transform translate-y-[-2px]"></div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 fade-in" style={{animationDelay: "0.3s"}}>
            {loading ? getDefaultAdvice(uvIndex) : aiAdvice}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UVCard;
