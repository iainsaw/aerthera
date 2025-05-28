
import React from 'react';
import { ForecastData } from '@/api/openweather';
import { getDayOfWeek } from '@/utils/dateUtils';
import { getTemperatureColor } from '@/utils/weatherUtils';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ForecastChartProps {
  forecastData: ForecastData;
  title?: string;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ forecastData, title = "5-Day Forecast" }) => {
  // Process forecast data for the chart
  const chartData = forecastData.list.map((item) => ({
    time: getDayOfWeek(item.dt) + ' ' + new Date(item.dt * 1000).getHours() + 'h',
    temperature: Math.round(item.main.temp),
    tempFeel: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    dt: item.dt
  }));
  
  const tempMin = Math.min(...chartData.map(item => item.temperature)) - 2;
  const tempMax = Math.max(...chartData.map(item => item.temperature)) + 2;

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorFeel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              dy={10} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.split(' ')[0]}
            />
            <YAxis 
              domain={[tempMin, tempMax]} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}°C`}
            />
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border border-border p-3 rounded-lg shadow-md">
                      <p className="text-sm font-medium">{label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <img 
                          src={`https://openweathermap.org/img/wn/${data.icon}.png`} 
                          alt={data.description}
                          className="w-8 h-8"
                        />
                        <p className="text-xs capitalize">{data.description}</p>
                      </div>
                      <p className="text-primary font-medium mt-1">
                        Temp: {data.temperature}°C
                      </p>
                      <p className="text-amber-500 text-xs">
                        Feels like: {data.tempFeel}°C
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Humidity: {data.humidity}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorTemp)"
              name="Temperature"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="tempFeel"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorFeel)"
              name="Feels like"
              strokeWidth={2}
              strokeDasharray="3 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ForecastChart;
