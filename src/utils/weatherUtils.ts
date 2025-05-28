
import { getAqiColor, getAqiDescription } from '../api/airvisual';
import { getUvIndexColor, getUvIndexDescription } from '../api/openmeteo';
import { WeatherData } from '../api/openweather';

export const getWeatherEmoji = (condition: string): string => {
  const emoji: Record<string, string> = {
    'Clear': '☀️',
    'Clouds': '⛅',
    'Rain': '🌧️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌁',
    'Tornado': '🌪️',
    'Drizzle': '🌦️',
    'Haze': '🌫️',
    'Dust': '💨',
    'Sand': '🌪️',
    'Ash': '🌋',
    'Squall': '🌬️'
  };
  
  return emoji[condition] || '⚠️';
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export const getCalendarEvent = (weatherData: WeatherData, date: string): string => {
  const eventDate = new Date(date);
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };
  
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Weather in ${weatherData.name}: ${weatherData.weather[0].description}
DTSTART:${formatDate(eventDate)}
DESCRIPTION:Temperature: ${weatherData.main.temp}°C\\nHumidity: ${weatherData.main.humidity}%\\nWind: ${weatherData.wind.speed} m/s
END:VEVENT
END:VCALENDAR`;
};

export const getUvAdvice = (uvIndex: number | null): string => {
  if (uvIndex === null) return "UV data unavailable";
  
  if (uvIndex <= 2) {
    return "No protection needed. You can safely stay outside.";
  } else if (uvIndex <= 5) {
    return "Protection recommended. Wear SPF 30+ and seek shade during midday.";
  } else if (uvIndex <= 7) {
    return "Protection essential. Limit sun exposure between 10am-4pm.";
  } else if (uvIndex <= 10) {
    return "Extra protection needed. Minimize sun exposure and reapply sunscreen.";
  } else {
    return "Maximum protection required. Avoid sun exposure when possible.";
  }
};

export const getAqiAdvice = (aqi: number | null): string => {
  if (aqi === null) return "Air quality data unavailable";
  
  if (aqi <= 50) {
    return "Air quality is good. Enjoy outdoor activities.";
  } else if (aqi <= 100) {
    return "Moderate air quality. Sensitive individuals should consider reducing prolonged outdoor activities.";
  } else if (aqi <= 150) {
    return "Unhealthy for sensitive groups. Older adults and children should limit prolonged outdoor exertion.";
  } else if (aqi <= 200) {
    return "Unhealthy air quality. Everyone may begin to experience health effects.";
  } else if (aqi <= 300) {
    return "Very unhealthy air quality. Avoid prolonged outdoor activities.";
  } else {
    return "Hazardous air quality. Avoid all outdoor physical activities.";
  }
};

export interface WeatherMetrics {
  uvIndex: { value: number | null; color: string; description: string; };
  aqi: { value: number | null; color: string; description: string; };
}

export const getWeatherMetrics = (uvIndex: number | null, aqi: number | null): WeatherMetrics => {
  return {
    uvIndex: {
      value: uvIndex,
      color: getUvIndexColor(uvIndex),
      description: getUvIndexDescription(uvIndex)
    },
    aqi: {
      value: aqi,
      color: getAqiColor(aqi),
      description: getAqiDescription(aqi)
    }
  };
};

// Enhance existing temperature color system
export const getTemperatureColor = (temp: number): string => {
  if (temp <= 0) return 'hsl(var(--primary))'; // Cold
  if (temp <= 15) return 'hsl(var(--success))'; // Cool
  if (temp <= 25) return 'hsl(var(--warning))'; // Warm
  return 'hsl(var(--danger))'; // Hot
};
