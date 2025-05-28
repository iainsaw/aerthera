import { toast } from "sonner";
import { WeatherData, ForecastData } from "./openweather";

const API_KEY = "AIzaSyDszY3keSo2H9PZyMdF---2psF5Ff2iKss";

type PromptType = 
  | "activitySuggestion" 
  | "gardeningTips" 
  | "floodRisk" 
  | "weatherImpact" 
  | "hydrationTips" 
  | "photographyTips"
  | "clothingAdvice"
  | "sunscreenAdvice"
  | "weatherQA"
  | "aqiAdvice"
  | "uvAdvice";  // Tambahkan ini

const prompts: Record<PromptType, (data: any) => string> = {
  clothingAdvice: (data) => `
    You are a weather-based clothing advisor AI.
    Current conditions:
    
    Location: ${data.weather.name}
    Weather: ${data.weather.weather[0].description}
    Temperature: ${data.weather.main.temp}°C
    Feels like: ${data.weather.main.feels_like}°C
    Humidity: ${data.weather.main.humidity}%
    Wind: ${data.weather.wind.speed} m/s
    
    Provide specific clothing recommendations for today:
    1. Type of clothing
    2. Layering advice if needed
    3. Additional accessories
    
    Keep suggestions practical and specific.
  `,
  activitySuggestion: (data) => `
    Based on the following weather data, suggest ONE specific outdoor or indoor activity that would be ideal for today. 
    Consider temperature, conditions, UV index, and time of day. Provide a concise reason why this activity is suitable.
    
    Current weather in ${data.weather.name}: ${data.weather.weather[0].description}
    Temperature: ${data.weather.main.temp}°C
    Feels like: ${data.weather.main.feels_like}°C
    Humidity: ${data.weather.main.humidity}%
    Wind speed: ${data.weather.wind.speed} m/s
    UV index: ${data.uvIndex !== undefined ? data.uvIndex : 'unavailable'}
    
    Format your response as a concise paragraph without any introductory text. Do not include emojis.
  `,
  
  gardeningTips: (data) => `
    Based on the following weather data, provide 3-5 specific gardening tips relevant for today's conditions.
    Consider soil moisture needs, watering advice, plant protection, and best times for gardening activities.
    
    Current weather in ${data.weather.name}: ${data.weather.weather[0].description}
    Temperature: ${data.weather.main.temp}°C
    Humidity: ${data.weather.main.humidity}%
    Wind speed: ${data.weather.wind.speed} m/s
    
    Format your response as a bulleted list without any introductory text. Do not include emojis.
  `,
  
  floodRisk: (data) => `
    You are a weather analysis AI assistant.
    Analyze flood risk based on this data:
    
    Location: ${data.weather.name}
    Current: ${data.weather.weather[0].description}
    ${data.forecast ? `
    Next 24h precipitation: ${data.forecast.list.slice(0, 8).map(item => 
      `${new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' })}: ${item.rain ? item.rain['3h'] : 0}mm`
    ).join(', ')}` : ''}
    
    Provide:
    1. Risk Level: (Low/Moderate/High/Severe)
    2. Brief explanation (1-2 sentences)
    3. Key precautions if needed
  `,
  
  weatherImpact: (data) => `
    You are a weather impact analysis AI.
    Analyze current conditions:
    
    Location: ${data.weather.name}
    Weather: ${data.weather.weather[0].description}
    Temperature: ${data.weather.main.temp}°C
    Humidity: ${data.weather.main.humidity}%
    Wind: ${data.weather.wind.speed} m/s
    
    Analyze impact on:
    1. Health (respiratory, joint pain, etc.)
    2. Transportation (road conditions, visibility)
    3. Energy consumption
    
    Keep responses concise and actionable.
  `,
  
  hydrationTips: (data) => `
    You are a health-focused weather AI.
    Analyze hydration needs:
    
    Location: ${data.weather.name}
    Weather: ${data.weather.weather[0].description}
    Temperature: ${data.weather.main.temp}°C
    Humidity: ${data.weather.main.humidity}%
    
    Provide:
    1. Base water intake (L/day)
    2. Activity adjustments
    3. Quick hydration tips
    
    Format as bullet points.
  `,
  
  photographyTips: (data) => `
    You are a photography assistant AI.
    Current conditions:
    
    Location: ${data.weather.name}
    Weather: ${data.weather.weather[0].description}
    Cloud cover: ${data.weather.clouds.all}%
    Sunrise: ${new Date(data.weather.sys.sunrise * 1000).toLocaleTimeString()}
    Sunset: ${new Date(data.weather.sys.sunset * 1000).toLocaleTimeString()}
    
    Provide 3 specific tips on:
    1. Best timing
    2. Camera settings
    3. Subject recommendations
    
    Keep tips practical and specific.
  `,
  
  sunscreenAdvice: (data) => `
    You are a sun protection advisor AI.
    Current conditions:
    
    Location: ${data.weather.name}
    Weather: ${data.weather.weather[0].description}
    UV Index: ${data.uvIndex !== undefined ? data.uvIndex : 'unavailable'}
    Cloud cover: ${data.weather.clouds.all}%
    
    Provide:
    1. Minimum SPF needed
    2. Reapplication timing
    3. Additional protection tips
    
    Format as short, clear bullet points.
  `,
  
  weatherQA: (data) => `
    You are an air quality expert AI.
    Current AQI data:
    
    Location: ${data.weather.name}
    AQI Level: ${data.aqi}
    Temperature: ${data.weather.main.temp}°C
    Humidity: ${data.weather.main.humidity}%
    Wind Speed: ${data.weather.wind.speed} m/s
    
    Provide:
    1. Brief health impact assessment
    2. Recommended precautions
    3. Suggested activities adjustment
    
    Keep response concise and informative.
    Focus on practical advice for students and young adults.
    Format as a single paragraph with key points.
  `,
  aqiAdvice: (data) => `
    You are an air quality expert AI.
    Current AQI data:
    
    Location: ${data.weather.name}
    AQI Level: ${data.aqi}
    Temperature: ${data.weather.main.temp}°C
    Humidity: ${data.weather.main.humidity}%
    Wind Speed: ${data.weather.wind.speed} m/s
    
    Provide:
    1. Brief health impact assessment
    2. Recommended precautions
    3. Suggested activities adjustment
    
    Keep response concise and informative.
    Focus on practical advice for students and young adults.
    Format as a single paragraph with key points.
  `,
  
  uvAdvice: (data) => `
    As a UV expert AI, give a very brief (max 15 words) advice about:
    UV Index: ${data.uvIndex}
    Time: ${new Date().toLocaleTimeString()}
    
    Focus on:
    - Protection needed
    - Quick action tips
    
    Keep it extremely concise, casual, and student-friendly.
  `,
  
  // ... existing code ...
};

export const generateAiContent = async (
  promptType: PromptType,
  data: { weather: WeatherData, forecast?: ForecastData, uvIndex?: number, aqi?: number, userQuery?: string }
): Promise<string> => {
  try {
    const prompt = prompts[promptType](data);
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          topK: 32,
          topP: 1,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate content: ${response.statusText}`);
    }

    const result: any = await response.json();
    
    if (result.promptFeedback?.blockReason) {
      throw new Error(`Content blocked: ${result.promptFeedback.blockReason}`);
    }

    if (!result.candidates || result.candidates.length === 0) {
      throw new Error("No content generated");
    }

    return result.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Error generating AI content:", error);
    toast.error("Failed to generate AI recommendation");
    return "Unable to generate recommendation at this time.";
  }
};
