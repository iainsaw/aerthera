
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricsCardProps {
  title: string;
  value: string | number | null;
  description: string;
  color?: string;
  icon: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  description, 
  color = "text-foreground",
  icon 
}) => {
  if (value === null) {
    return (
      <Card className="notion-metric-card hover-lift fade-in h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="text-muted-foreground">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="empty-state py-3">
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="notion-metric-card hover-lift fade-in h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-primary/80">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
