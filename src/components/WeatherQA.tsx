
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateAiContent } from '@/api/gemini';
import { WeatherData, ForecastData } from '@/api/openweather';
import { BrainCircuit, Send } from 'lucide-react';
import { toast } from 'sonner';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface WeatherQAProps {
  weather: WeatherData;
  forecast?: ForecastData;
  uvIndex?: number | null;
  aqi?: number | null;
}

const WeatherQA: React.FC<WeatherQAProps> = ({ 
  weather, 
  forecast,
  uvIndex,
  aqi
}) => {
  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasAsked, setHasAsked] = useState<boolean>(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    setLoading(true);
    try {
      const content = await generateAiContent("weatherQA", {
        weather,
        forecast,
        uvIndex: uvIndex || undefined,
        aqi: aqi || undefined,
        userQuery: query
      });
      
      setAnswer(cleanAiResponse(content));
      setHasAsked(true);
    } catch (error) {
      console.error("Error getting answer:", error);
      toast.error("Failed to get an answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="weather-card transition-all duration-300 ios-spring-in min-h-[200px] h-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Ask About Your Weather Data</CardTitle>
        <HoverCard>
          <HoverCardTrigger asChild>
            <BrainCircuit className="h-4 w-4 text-primary cursor-help" />
          </HoverCardTrigger>
          <HoverCardContent className="w-80 text-sm">
            Ask any questions about your current weather data and get AI-powered answers to help you understand the conditions.
          </HoverCardContent>
        </HoverCard>
      </CardHeader>
      <CardContent className="pt-2">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Input 
              placeholder="Ask anything about today's weather..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="sm"
              disabled={loading || !query.trim()}
              className="ios-spring-in"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
        
        {loading && (
          <div className="mt-4 animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        )}
        
        {hasAsked && !loading && (
          <div className="mt-4 text-sm">
            <div className="font-medium mb-1 ios-fade-in">Answer:</div>
            <div className="text-muted-foreground ios-fade-in space-y-2" style={{animationDelay: "0.1s"}}>
              {answer.split('\n\n').map((paragraph, index) => (
                <p key={index} className="ios-fade-in" style={{animationDelay: `${0.2 + (0.1 * index)}s`}}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
        
        {!hasAsked && !loading && (
          <div className="mt-4 text-xs text-center text-muted-foreground ios-fade-in">
            Ask about temperature, humidity, UV index, or any other weather metric for {weather.name}.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherQA;
