
import { toast } from "sonner";

const BASE_URL = "https://api.open-meteo.com/v1";

export interface UvIndexData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    uv_index_max: string;
  };
  daily: {
    time: string[];
    uv_index_max: number[];
  };
}

export const getUvIndex = async (lat: number, lon: number): Promise<number | null> => {
  try {
    const url = `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max&timezone=auto`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch UV index: ${response.statusText}`);
    }
    
    const data: UvIndexData = await response.json();
    // Return today's UV index
    return data.daily.uv_index_max[0];
  } catch (error) {
    console.error("Error fetching UV index:", error);
    return null;
  }
};

export const getUvIndexColor = (uvIndex: number | null): string => {
  if (uvIndex === null) return "#A0AEC0"; // Gray for unavailable
  
  if (uvIndex <= 2) return "#4ade80"; // Green - Low
  if (uvIndex <= 5) return "#facc15"; // Yellow - Moderate
  if (uvIndex <= 7) return "#fb923c"; // Orange - High
  if (uvIndex <= 10) return "#f43f5e"; // Red - Very High
  return "#7e22ce"; // Purple - Extreme
};

export const getUvIndexDescription = (uvIndex: number | null): string => {
  if (uvIndex === null) return "Unavailable";
  
  if (uvIndex <= 2) return "Low";
  if (uvIndex <= 5) return "Moderate";
  if (uvIndex <= 7) return "High";
  if (uvIndex <= 10) return "Very High";
  return "Extreme";
};
