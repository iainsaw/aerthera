
import React from 'react';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface LocalWeatherProps {
  onWeatherFound: (city: string) => void;
}

const LocalWeather: React.FC<LocalWeatherProps> = ({ onWeatherFound }) => {
  const { latitude, longitude, error, loading } = useGeolocation();

  const { data: weather, isLoading } = useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) return null;
      
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=7f520b1b64c7b8efd30d9f300b9de6d6`
        );
        
        if (!response.ok) {
          throw new Error('Failed to get location name');
        }
        
        const data = await response.json();
        if (data && data[0]) {
          const cityName = data[0].name;
          onWeatherFound(cityName);
          return cityName;
        }
        return null;
      } catch (error) {
        console.error('Error getting location name:', error);
        toast.error('Failed to get your location name');
        return null;
      }
    },
    enabled: !!(latitude && longitude),
  });

  if (error) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading || isLoading}
      onClick={() => weather && onWeatherFound(weather)}
      className="subtle-bounce hover-lift"
    >
      <MapPin className="h-4 w-4 mr-2" />
      {loading || isLoading ? 'Getting location...' : 'Use my location'}
    </Button>
  );
};

export default LocalWeather;
