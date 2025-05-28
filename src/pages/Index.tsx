import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertTriangle,
  ArrowDown,
  BrainCircuit,
  Cloud,
  CloudRain,
  Droplets,
  Map,
  MapPin,
  Shirt,
  Smile,
  SparkleIcon,
  Sun,
  SunMedium,
  Thermometer as ThermometerIcon,
  Umbrella
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ThemeToggle } from "@/components/ThemeProvider";
import { NotificationToggle } from "@/components/NotificationToggle";
import LocalWeather from '@/components/LocalWeather';
import DailyWeatherTip from '@/components/DailyWeatherTip';
import HomeHero from '@/components/HomeHero';

// API imports
import { WeatherData, ForecastData, getWeatherData, getForecastData } from '@/api/openweather';
import { getAirQuality } from '@/api/airvisual'; // Pastikan path ini benar jika Anda menggunakan IQAir
import { getUvIndex } from '@/api/openmeteo';

// Component imports
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import MetricsCard from '@/components/MetricsCard';
import UVCard from '@/components/UVCard';
import AQICard from '@/components/AQICard'; // Pastikan AQICardProps di file ini mengharapkan 'weather'
import ForecastChart from '@/components/ForecastChart';
import HourlyForecast from '@/components/HourlyForecast';
import WeatherMap from '@/components/WeatherMap';
// Hapus baris import ini
// import AQIMap from '@/components/AQIMap';
import AIInsightsCard from '@/components/AIInsightsCard';
import CalendarExport from '@/components/CalendarExport';
import CompareCitiesTable from '@/components/CompareCitiesTable';
import HydrationCalculator from '@/components/HydrationCalculator';
import PollenRiskCalculator from '@/components/PollenRiskCalculator';
import PhotographyAssistant from '@/components/PhotographyAssistant';
import ClothingRecommendation from '@/components/ClothingRecommendation';
import SunscreenAdvice from '@/components/SunscreenAdvice';
import WeatherQA from '@/components/WeatherQA';

const Index = () => {
  // State for weather data
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [forecastData, setForecastData] = useState<Record<string, ForecastData>>({});

  // State for metrics data
  const [aqiData, setAqiData] = useState<Record<string, number | null>>({});
  const [uvData, setUvData] = useState<Record<string, number | null>>({});

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>("aerthera-search-history", []);

  // Handle search functionality
  const handleSearch = async (query: string) => {
    setLoading(true);

    try {
      const cities = query.split(',').map(city => city.trim()).filter(Boolean);
      const weatherResults: WeatherData[] = [];
      const forecastResults: Record<string, ForecastData> = {};
      const aqiResults: Record<string, number | null> = {};
      const uvResults: Record<string, number | null> = {};

      for (const city of cities) {
        const weather = await getWeatherData(city);

        if (weather) {
          weatherResults.push(weather);

          // Get forecast data
          const forecast = await getForecastData(city);
          if (forecast) {
            forecastResults[weather.name] = forecast;
          }

          // Get AQI data
          const aqi = await getAirQuality(weather.coord.lat, weather.coord.lon);
          aqiResults[weather.name] = aqi;

          // Get UV index
          const uv = await getUvIndex(weather.coord.lat, weather.coord.lon);
          uvResults[weather.name] = uv;
        }
      }

      if (weatherResults.length) {
        setWeatherData(weatherResults);
        setForecastData(forecastResults);
        setAqiData(aqiResults);
        setUvData(uvResults);
        setSelectedCity(weatherResults[0].name);

        // Update search history
        const newHistory = Array.from(new Set([...cities.filter(city => {
          return weatherResults.some(w => w.name.toLowerCase() === city.toLowerCase());
        }), ...searchHistory])).slice(0, 8);

        setSearchHistory(newHistory);

        toast.success(`Weather data loaded for ${weatherResults.map(w => w.name).join(', ')}`);
      } else {
        toast.error('No weather data found. Please check city names and try again.');
      }
    } catch (error) {
      console.error('Error searching cities:', error);
      toast.error('Failed to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle selection of a recent search
  const handleSelectRecentSearch = (city: string) => {
    handleSearch(city);
  };

  // Handle removing a city from recent searches
  const handleClearRecentSearch = (city: string) => {
    const newHistory = searchHistory.filter(c => c !== city);
    setSearchHistory(newHistory);
    toast.success(`Removed ${city} from search history`);
  };

  // Load initial weather data for a default city
  useEffect(() => {
    if (searchHistory.length > 0 && weatherData.length === 0) { // Hanya load jika weatherData kosong
      handleSearch(searchHistory[0]);
    }
  }, [searchHistory]); // Tambahkan weatherData.length ke dependency jika ingin re-fetch saat history berubah tapi data sudah ada

  // Get the currently selected city's data
  const currentCityWeather = selectedCity
    ? weatherData.find(city => city.name === selectedCity)
    : weatherData[0];

  const currentCityForecast = currentCityWeather
    ? forecastData[currentCityWeather.name]
    : null;

  // City selector
  const citySelector = weatherData.length > 1 ? (
    <div className="flex flex-wrap gap-2 mb-6">
      {weatherData.map(city => (
        <Button
          key={city.id}
          variant={selectedCity === city.name ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCity(city.name)}
          className="ios-spring-in"
          style={{ animationDelay: `${Math.random() * 0.3}s` }}
        >
          <MapPin className="h-3.5 w-3.5 mr-1.5" />
          {city.name}
        </Button>
      ))}
    </div>
  ) : null;

  return (
    <div className="min-h-screen container py-8 px-4 md:py-12 md:px-6">
      <header className="mb-8 slide-up flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Placeholder for potential logo or app name */}
          {/* <img src="/logo.svg" alt="Aerthera Logo" className="h-8 w-auto" /> */}
          {/* <h1 className="text-2xl font-bold">Aerthera</h1> */}
        </div>
        <div className="flex items-center gap-2">
          <NotificationToggle />
          <ThemeToggle />
        </div>
      </header>

      <HomeHero />

      {/* Search Section */}
      <div className="mb-8 fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex flex-col gap-2">
          <SearchBar
            onSearch={handleSearch}
            recentSearches={searchHistory}
            onSelectRecentSearch={handleSelectRecentSearch}
            onClearRecentSearch={handleClearRecentSearch}
          />
          <div className="flex justify-end">
            <LocalWeather onWeatherFound={handleSearch} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-muted-foreground">Loading weather data...</p>
        </div>
      ) : weatherData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center fade-in">
          <Cloud className="h-20 w-20 text-muted-foreground mb-6 opacity-60" />
          <h2 className="text-2xl font-bold mb-3 fade-in" style={{ animationDelay: "0.1s" }}>Welcome to Aerthera</h2>
          <p className="text-muted-foreground max-w-md fade-in" style={{ animationDelay: "0.2s" }}>
            Search for a city to get started with real-time weather information,
            forecasts, and AI-powered insights.
          </p>
        </div>
      ) : (
        <>
          {citySelector}

          <Tabs defaultValue="current" className="space-y-6">
            <TabsList className="notion-blur border border-border/30 fade-in grid grid-cols-3 sm:grid-cols-6 w-full md:w-auto">
              <TabsTrigger value="current" className="subtle-bounce">
                <Sun className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Current</span>
                <span className="sm:hidden">Now</span>
              </TabsTrigger>
              <TabsTrigger value="forecast" className="subtle-bounce">
                <CloudRain className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Forecast</span>
                <span className="sm:hidden">Soon</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="subtle-bounce">
                <Map className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Maps</span>
                <span className="sm:hidden">Map</span>
              </TabsTrigger>
              <TabsTrigger value="compare" className="subtle-bounce">
                <ArrowDown className="h-4 w-4 mr-1.5" /> {/* Icon bisa diganti jika lebih sesuai */}
                <span className="hidden sm:inline">Compare</span>
                <span className="sm:hidden">VS</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="subtle-bounce">
                <SparkleIcon className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Insights</span>
                <span className="sm:hidden">Tips</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="subtle-bounce">
                <BrainCircuit className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">AI Assist</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
            </TabsList>

            {currentCityWeather && (
              <>
                {/* Current Weather Tab */}
                <TabsContent value="current" className="space-y-6 fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <WeatherCard data={currentCityWeather} />
                      <DailyWeatherTip weather={currentCityWeather} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 h-fit">
                      <UVCard uvIndex={uvData[currentCityWeather.name] || null} />
                      {/* PERBAIKAN DI SINI */}
                      <AQICard
                        weather={currentCityWeather}
                        aqi={aqiData[currentCityWeather.name] || null}
                      />
                    </div>
                  </div>

                  {currentCityForecast && (
                    <div className="fade-in" style={{ animationDelay: "0.3s" }}>
                      <h3 className="text-lg font-medium mb-3">Next 24 Hours</h3>
                      <HourlyForecast forecastData={currentCityForecast} hours={8} />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AIInsightsCard
                      weather={currentCityWeather}
                      forecast={currentCityForecast || undefined}
                      uvIndex={uvData[currentCityWeather.name] || null}
                      aqi={aqiData[currentCityWeather.name] || null}
                      insightType="activitySuggestion"
                      title="Activity Suggestion"
                    />

                    <AIInsightsCard
                      weather={currentCityWeather}
                      forecast={currentCityForecast || undefined}
                      uvIndex={uvData[currentCityWeather.name] || null}
                      aqi={aqiData[currentCityWeather.name] || null}
                      insightType="weatherImpact"
                      title="Weather Impact"
                    />

                    <CalendarExport weather={currentCityWeather} />
                  </div>
                </TabsContent>

                {/* Forecast Tab */}
                <TabsContent value="forecast" className="space-y-6">
                  {currentCityForecast ? (
                    <>
                      <div className="ios-fade-in">
                        <ForecastChart forecastData={currentCityForecast} />
                      </div>

                      <div className="ios-fade-in" style={{ animationDelay: "0.1s" }}>
                        <h3 className="text-lg font-medium mb-3">Hourly Forecast</h3>
                        <HourlyForecast forecastData={currentCityForecast} hours={24} />
                      </div>

                      <Alert className="ios-fade-in" style={{ animationDelay: "0.2s" }}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Weather Alert</AlertTitle>
                        <AlertDescription>
                          This forecast is updated every 3 hours and may change.
                          Last updated: {new Date(currentCityForecast.list[0].dt * 1000).toLocaleString()}
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-muted-foreground">
                        Forecast data is not available for {currentCityWeather.name}.
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* Map Tab */}
                <TabsContent value="map" className="space-y-6">
                  <WeatherMap city={currentCityWeather} />
                  {/* Hapus bagian AQIMap ini
                  {weatherData.length >= 1 && (
                    <AQIMap
                      cities={weatherData}
                      aqiData={aqiData}
                    />)}
                  */}
                </TabsContent>

                {/* Compare Tab */}
                <TabsContent value="compare" className="space-y-6">
                  {weatherData.length > 1 ? (
                    <>
                      <div className="ios-fade-in">
                        <CompareCitiesTable
                          cities={weatherData}
                          aqiData={aqiData}
                          uvData={uvData}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {weatherData.map((city, index) => (
                          <div key={city.id} className="ios-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                            <h3 className="text-lg font-medium mb-3">{city.name}</h3>
                            <div className="grid grid-cols-2 gap-3">
                              <MetricsCard
                                title="Temperature"
                                value={`${Math.round(city.main.temp)}°C`}
                                description={`Feels like ${Math.round(city.main.feels_like)}°C`}
                                icon={<ThermometerIcon className="h-4 w-4" />}
                              />
                              <MetricsCard
                                title="Humidity"
                                value={`${city.main.humidity}%`}
                                description="Relative humidity"
                                icon={<Droplets className="h-4 w-4" />}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="py-20 text-center ios-fade-in">
                      <p className="text-muted-foreground">
                        Search for multiple cities to compare their weather conditions.
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* AI Insights & Tools Tab */}
                <TabsContent value="insights" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ClothingRecommendation
                      weather={currentCityWeather}
                      forecast={currentCityForecast || undefined}
                      uvIndex={uvData[currentCityWeather.name] || null}
                      aqi={aqiData[currentCityWeather.name] || null}
                    />
                    <SunscreenAdvice
                      weather={currentCityWeather}
                      forecast={currentCityForecast || undefined}
                      uvIndex={uvData[currentCityWeather.name] || null}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <HydrationCalculator weather={currentCityWeather} />
                    <PollenRiskCalculator weather={currentCityWeather} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PhotographyAssistant weather={currentCityWeather} />
                    <AIInsightsCard
                      weather={currentCityWeather}
                      forecast={currentCityForecast || undefined}
                      insightType="floodRisk"
                      title="Flood Risk Analysis"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AIInsightsCard
                      weather={currentCityWeather}
                      forecast={currentCityForecast || undefined}
                      insightType="gardeningTips"
                      title="Smart Gardening Tips"
                    />
                    <AIInsightsCard
                      weather={currentCityWeather}
                      forecast={currentCityForecast || undefined}
                      insightType="hydrationTips"
                      title="Hydration Advice"
                    />
                  </div>
                </TabsContent>

                {/* New AI Assist Tab */}
                <TabsContent value="ai" className="space-y-6">
                  <div className="ios-fade-in">
                    <WeatherQA
                      weather={currentCityWeather}
                      forecast={currentCityForecast || undefined}
                      uvIndex={uvData[currentCityWeather.name] || null}
                      aqi={aqiData[currentCityWeather.name] || null}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Personal Recommendations</h3>
                      <AIInsightsCard
                        weather={currentCityWeather}
                        forecast={currentCityForecast || undefined}
                        uvIndex={uvData[currentCityWeather.name] || null}
                        aqi={aqiData[currentCityWeather.name] || null}
                        insightType="clothingAdvice"
                        title="What to Wear"
                      />
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Safety & Protection</h3>
                      <AIInsightsCard
                        weather={currentCityWeather}
                        forecast={currentCityForecast || undefined}
                        uvIndex={uvData[currentCityWeather.name] || null}
                        aqi={aqiData[currentCityWeather.name] || null}
                        insightType="sunscreenAdvice"
                        title="Sun Protection Advice"
                      />
                    </div>
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </>
      )}

      <footer className="mt-16 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground fade-in">
        <p className="mb-2">Aerthera Weather App - Your Intelligent Weather Companion</p>
        <p>Powered by OpenWeatherMap, Google Gemini AI, Open-Meteo and AirVisual (or IQAir)</p>
      </footer>
    </div>
  );
};

export default Index;