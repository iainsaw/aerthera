
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString([], { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString([], { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const getDayOfWeek = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString([], { 
    weekday: 'short' 
  });
};

export const groupForecastByDay = (list: any[]): any[] => {
  const days: Record<string, any[]> = {};
  
  list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!days[date]) {
      days[date] = [];
    }
    days[date].push(item);
  });
  
  return Object.values(days);
};

export const isDay = (dt: number, sunrise: number, sunset: number): boolean => {
  return dt > sunrise && dt < sunset;
};
