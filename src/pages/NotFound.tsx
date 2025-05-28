
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CloudOff, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/50 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center p-6 bg-secondary rounded-full mb-6">
          <CloudOff size={40} className="text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! This page is lost in the clouds</p>
        <Button asChild size="lg" className="gap-2">
          <a href="/">
            <Home size={16} />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
