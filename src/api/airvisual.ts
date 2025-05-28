
import { toast } from "sonner";

const API_KEY = "100db6cd-a0b8-448c-bd12-6f9132411612";
const BASE_URL = "http://api.airvisual.com/v2";

export interface AirQualityData {
  status: string;
  data: {
    city: string;
    state: string;
    country: string;
    location: {
      type: string;
      coordinates: number[];
    };
    current: {
      pollution: {
        ts: string;
        aqius: number;
        mainus: string;
        aqicn: number;
        maincn: string;
      };
      weather: {
        ts: string;
        tp: number;
        pr: number;
        hu: number;
        ws: number;
        wd: number;
        ic: string;
      };
    };
  };
}

export const getAirQuality = async (lat: number, lon: number): Promise<number | null> => {
  try {
    const url = `${BASE_URL}/nearest_city?lat=${lat}&lon=${lon}&key=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch air quality data: ${response.statusText}`);
    }
    
    const data: AirQualityData = await response.json();
    return data.data.current.pollution.aqius;
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    return null;
  }
};

export const getAqiColor = (aqi: number | null): string => {
  if (aqi === null) return "#A0AEC0"; // Gray for unavailable
  
  if (aqi <= 50) return "#4ade80"; // Green - Good
  if (aqi <= 100) return "#facc15"; // Yellow - Moderate
  if (aqi <= 150) return "#fb923c"; // Orange - Unhealthy for Sensitive Groups
  if (aqi <= 200) return "#ef4444"; // Red - Unhealthy
  if (aqi <= 300) return "#8f3f97"; // Purple - Very Unhealthy
  return "#7e0023"; // Maroon - Hazardous
};

export const getAqiDescription = (aqi: number | null): string => {
  if (aqi === null) return "Unavailable";
  
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};
