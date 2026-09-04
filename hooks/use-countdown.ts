"use client";

import { useEffect, useState } from "react";

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

function calculate(target: string): CountdownValue {
  const diff = new Date(target).getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, completed: false };
}

export function useCountdown(targetDate: string) {
  const [value, setValue] = useState<CountdownValue>(() => calculate(targetDate));

  useEffect(() => {
    setValue(calculate(targetDate));
    const id = window.setInterval(() => setValue(calculate(targetDate)), 1000);
    return () => window.clearInterval(id);
  }, [targetDate]);

  return value;
}
