
import React from 'react';
import { WeatherData } from '@/api/openweather';
import { formatTime } from '@/utils/dateUtils';
import { Cloud, Droplets, Eye, Gauge, ThermometerIcon, Wind } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const { weather, main, wind, clouds, visibility, sys } = data;
  const mainWeather = weather[0];
  
  const iconUrl = `https://openweathermap.org/img/wn/${mainWeather.icon}@2x.png`;

  return (
    <div className="ios-spring-in">
      <Card className="weather-card overflow-hidden">
        <CardHeader className="pb-0 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">{data.name}</CardTitle>
              <CardDescription className="text-lg">{data.sys.country}</CardDescription>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-5xl font-bold">{Math.round(main.temp)}°</span>
              <span className="text-muted-foreground text-sm">
                Feels like {Math.round(main.feels_like)}°
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-6 pt-3">
          <div className="flex items-center mb-4">
            <img 
              src={iconUrl} 
              alt={mainWeather.description} 
              className="w-20 h-20 ios-scale-in" 
            />
            <div className="ml-2 ios-fade-in">
              <h3 className="font-medium capitalize text-lg">{mainWeather.description}</h3>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 ios-slide-up">
            <div className="weather-metric-card flex items-center">
              <ThermometerIcon className="h-5 w-5 mr-3 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Min / Max</div>
                <div className="font-medium">{Math.round(main.temp_min)}° / {Math.round(main.temp_max)}°</div>
              </div>
            </div>
            
            <div className="weather-metric-card flex items-center">
              <Droplets className="h-5 w-5 mr-3 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Humidity</div>
                <div className="font-medium">{main.humidity}%</div>
              </div>
            </div>
            
            <div className="weather-metric-card flex items-center">
              <Gauge className="h-5 w-5 mr-3 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Pressure</div>
                <div className="font-medium">{main.pressure} hPa</div>
              </div>
            </div>
            
            <div className="weather-metric-card flex items-center">
              <Wind className="h-5 w-5 mr-3 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Wind</div>
                <div className="font-medium">{wind.speed} m/s</div>
              </div>
            </div>
            
            <div className="weather-metric-card flex items-center">
              <Cloud className="h-5 w-5 mr-3 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Clouds</div>
                <div className="font-medium">{clouds.all}%</div>
              </div>
            </div>
            
            <div className="weather-metric-card flex items-center">
              <Eye className="h-5 w-5 mr-3 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Visibility</div>
                <div className="font-medium">{(visibility / 1000).toFixed(1)} km</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5 ios-slide-up" style={{animationDelay: "0.1s"}}>
            <div className="weather-metric-card p-4">
              <div className="text-xs text-muted-foreground">Sunrise</div>
              <div className="text-lg font-medium">{formatTime(sys.sunrise)}</div>
            </div>
            <div className="weather-metric-card p-4">
              <div className="text-xs text-muted-foreground">Sunset</div>
              <div className="text-lg font-medium">{formatTime(sys.sunset)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherCard;
