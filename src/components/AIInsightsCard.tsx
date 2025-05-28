
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateAiContent } from '@/api/gemini';
import { WeatherData, ForecastData } from '@/api/openweather';
import { Sparkles, Building2 } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface AIInsightsCardProps {
  weather: WeatherData;
  forecast?: ForecastData;
  uvIndex?: number | null;
  aqi?: number | null;
  insightType: 'activitySuggestion' | 'gardeningTips' | 'floodRisk' | 'weatherImpact' | 'hydrationTips' | 'photographyTips' | 'clothingAdvice' | 'sunscreenAdvice';
  title: string;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ 
  weather, 
  forecast,
  uvIndex,
  aqi,
  insightType,
  title
}) => {
  const [content, setContent] = useState<string>('');
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
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const result = await generateAiContent(insightType, { 
          weather, 
          forecast,
          uvIndex,
          aqi
        });
        setContent(cleanAiResponse(result));
      } catch (error) {
        console.error('Error fetching AI insights:', error);
        setContent('');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, [weather, forecast, uvIndex, aqi, insightType]);

  return (
    <Card className="notion-card transition-all duration-300 fade-in hover-lift min-h-[180px] h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Building2 className="h-4 w-4 text-primary cursor-help" />
          </HoverCardTrigger>
          <HoverCardContent className="notion-card w-80 text-sm">
            <p>AI-generated weather insights specifically tailored to {title.toLowerCase()} based on current conditions.</p>
          </HoverCardContent>
        </HoverCard>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="flex flex-col gap-2 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        ) : content ? (
          <div className="text-sm font-normal leading-relaxed space-y-2">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="fade-in" style={{animationDelay: `${0.1 * index}s`}}>
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">✨</div>
            <p className="empty-state-text">Insights are being generated. Check back in a moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;
