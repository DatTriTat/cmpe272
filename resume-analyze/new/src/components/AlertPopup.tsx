import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/react"; 

type AlertPopupProps = {
  message: string;
  duration?: number;
  onClose?: () => void;
};

export function AlertPopup({
  message,
  duration = 2000,
  onClose,  
}: AlertPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 w-fit max-w-sm">
      <Card className="bg-blue-600 text-white rounded-lg shadow-lg">
        <CardBody className="py-3 px-5 text-sm font-medium text-center">
          {message}
        </CardBody>
      </Card>
    </div>
  );
}
