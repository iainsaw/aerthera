
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateAiContent } from '@/api/gemini';
import { WeatherData, ForecastData } from '@/api/openweather';
import { Shirt } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface ClothingRecommendationProps {
  weather: WeatherData;
  forecast?: ForecastData;
  uvIndex?: number | null;
  aqi?: number | null;
}

const ClothingRecommendation: React.FC<ClothingRecommendationProps> = ({ 
  weather, 
  forecast,
  uvIndex,
  aqi 
}) => {
  const [recommendations, setRecommendations] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Function to clean markdown formatting from AI responses
  const cleanAiResponse = (text: string): string => {
    // Remove markdown bold markers ** and *
    return text.replace(/\*\*/g, '').replace(/\*/g, '')
      // Replace markdown headers (e.g., ##, ###) with proper styling
      .replace(/#{1,6}\s+([^\n]+)/g, '$1')
      // Clean up excess whitespace/newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const result = await generateAiContent("clothingAdvice", { 
          weather, 
          forecast,
          uvIndex: uvIndex || undefined,
          aqi: aqi || undefined
        });
        setRecommendations(cleanAiResponse(result));
      } catch (error) {
        console.error('Error fetching clothing recommendations:', error);
        setRecommendations('Unable to generate clothing recommendations at this time.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [weather, forecast, uvIndex, aqi]);

  return (
    <Card className="weather-card transition-all duration-300 ios-spring-in min-h-[200px] h-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Clothing Recommendation</CardTitle>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Shirt className="h-4 w-4 text-primary cursor-help" />
          </HoverCardTrigger>
          <HoverCardContent className="w-80 text-sm">
            Smart clothing suggestions based on current weather conditions and forecast to keep you comfortable throughout the day.
          </HoverCardContent>
        </HoverCard>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="flex flex-col gap-2 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-4 bg-muted rounded w-4/6"></div>
          </div>
        ) : (
          <div className="text-sm font-normal leading-relaxed space-y-2">
            {recommendations.split('\n\n').map((paragraph, index) => (
              <p key={index} className="ios-fade-in" style={{animationDelay: `${0.1 * index}s`}}>
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClothingRecommendation;
