
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets } from 'lucide-react';
import { WeatherData } from '@/api/openweather';

interface HydrationCalculatorProps {
  weather: WeatherData;
}

const HydrationCalculator: React.FC<HydrationCalculatorProps> = ({ weather }) => {
  const [weight, setWeight] = useState<number>(70);
  const [activity, setActivity] = useState<string>("moderate");
  const [waterIntake, setWaterIntake] = useState<number>(0);
  
  useEffect(() => {
    // Calculate recommended water intake based on weight, temperature, and activity level
    const baseWater = weight * 0.033; // Base water intake (liters) per kg of body weight
    const tempFactor = weather.main.temp / 30; // Temperature factor (increases as temperature rises)
    
    // Activity factors
    const activityFactors = {
      sedentary: 1.0,
      moderate: 1.2,
      high: 1.5
    };
    
    const activityFactor = activityFactors[activity as keyof typeof activityFactors];
    
    // Calculate total water intake
    const total = baseWater * (1 + tempFactor) * activityFactor;
    setWaterIntake(total);
  }, [weight, activity, weather]);
  
  return (
    <Card className="weather-card overflow-hidden ios-spring-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Hydration Assistant</CardTitle>
        <Droplets className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Weight: {weight} kg</label>
            <Slider
              defaultValue={[weight]}
              min={40}
              max={150}
              step={1}
              onValueChange={(values) => setWeight(values[0])}
              className="ios-fade-in"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Activity Level</label>
            <Select defaultValue={activity} onValueChange={setActivity}>
              <SelectTrigger className="bg-white/50 dark:bg-card/50 backdrop-blur ios-fade-in" style={{animationDelay: "0.1s"}}>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-2 ios-fade-in" style={{animationDelay: "0.2s"}}>
            <div className="text-xs text-muted-foreground">Recommended Daily Water Intake</div>
            <div className="text-3xl font-bold text-primary">{waterIntake.toFixed(1)} L</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on your weight, activity level, and current temperature of {Math.round(weather.main.temp)}°C
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HydrationCalculator;
