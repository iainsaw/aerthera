
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BellOff, Bell } from "lucide-react";
import { requestNotificationPermission } from "@/services/notificationService";

export function NotificationToggle() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsEnabled(Notification.permission === "granted");
  }, []);

  const handleToggle = async () => {
    const granted = await requestNotificationPermission();
    setIsEnabled(granted);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="ios-spring-in"
    >
      {isEnabled ? (
        <Bell className="h-5 w-5" />
      ) : (
        <BellOff className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle notifications</span>
    </Button>
  );
}
