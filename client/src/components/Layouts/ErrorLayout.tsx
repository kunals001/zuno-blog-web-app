// components/ui/ErrorToast.tsx
"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type Props = {
  message: string | null;
  duration?: number;
  onClose?: () => void;
};

const ErrorToast = ({ message, duration = 3000, onClose }: Props) => {
  const [visible, setVisible] = useState(true);

  const isValidMessage = typeof message === "string" && message.trim() !== "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isValidMessage || !visible) return null;

  return (
    <div
      className={clsx(
        "fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999]",
        "bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg max-w-[90%] text-center text-sm sm:text-base",
        "animate-slideDownFade"
      )}
    >
      {message}
    </div>
  );
};

export default ErrorToast;
