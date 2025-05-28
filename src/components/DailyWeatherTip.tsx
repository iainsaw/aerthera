
import React, { useState, useEffect } from 'react';
import { WeatherData } from '@/api/openweather';
import { Lightbulb } from 'lucide-react';

interface DailyWeatherTipProps {
  weather: WeatherData;
}

// Define a type for our weather tips
interface WeatherTips {
  [key: string]: string[];
}

const DailyWeatherTip: React.FC<DailyWeatherTipProps> = ({ weather }) => {
  const [tip, setTip] = useState<string>('');
  
  useEffect(() => {
    // Generate a tip based on the current weather conditions
    const weatherCondition = weather.weather[0].main.toLowerCase();
    const temp = weather.main.temp;
    
    const tips: WeatherTips = {
      'clear': [
        "Perfect day for outdoor activities! Don't forget sun protection.",
        "Stay hydrated today - it's sunny out there!",
        "Great day for a walk or outdoor exercise."
      ],
      'clouds': [
        "Diffused light today - perfect for photography!",
        "A light jacket might be comfortable today.",
        "Good day for a run with less direct sun."
      ],
      'rain': [
        "Don't forget your umbrella today! ☔",
        "Waterproof shoes might be a good idea.",
        "Perfect day to catch up on indoor activities."
      ],
      'drizzle': [
        "Light rain today - a water-resistant jacket should be enough.",
        "Be careful on wet roads if you're driving.",
        "A hat with a brim will keep drizzle off your face."
      ],
      'thunderstorm': [
        "Stay safe - avoid open spaces during thunderstorms!",
        "Good day to stay indoors and listen to the rain.",
        "Charge your devices in case of power outages."
      ],
      'snow': [
        "Bundle up - it's snowy outside! ❄️",
        "Allow extra time for travel today.",
        "Waterproof boots will keep your feet dry today."
      ],
      'mist': [
        "Drive carefully - visibility might be reduced.",
        "Fog lights are helpful in these conditions.",
        "A bright outer layer helps others see you."
      ],
      'fog': [
        "Take care in reduced visibility conditions.",
        "Consider delaying travel if fog is dense.",
        "Keep distances between vehicles if driving."
      ],
      'hot': [],
      'cold': []
    };

    // Add temperature-based tips
    if (temp > 30) {
      tips.hot = [
        "It's very hot - stay hydrated and seek shade when possible.",
        "Consider rescheduling strenuous activities to cooler hours.",
        "Lightweight, loose-fitting clothing will help you stay cool."
      ];
    } else if (temp < 5) {
      tips.cold = [
        "It's quite cold - dress in layers and cover extremities.",
        "Warm drinks can help maintain body temperature.",
        "Keep moving to generate body heat in these cold conditions."
      ];
    }

    // Select a tip based on weather and temperature
    let relevantTips: string[];
    
    if (weatherCondition in tips) {
      relevantTips = tips[weatherCondition];
    } else if (temp > 30 && tips.hot.length > 0) {
      relevantTips = tips.hot;
    } else if (temp < 5 && tips.cold.length > 0) {
      relevantTips = tips.cold;
    } else {
      relevantTips = tips.clear; // Default to clear weather tips
    }
    
    const randomTip = relevantTips[Math.floor(Math.random() * relevantTips.length)];
    setTip(randomTip);
  }, [weather]);

  if (!tip) return null;

  return (
    <div className="daily-tip slide-up">
      <span className="daily-tip-icon">
        <Lightbulb size={18} />
      </span>
      <p className="daily-tip-content">{tip}</p>
    </div>
  );
};

export default DailyWeatherTip;
