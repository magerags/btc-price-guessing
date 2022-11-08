import { useEffect, useState } from "react";

export default function useStickyState(key, defaultValue = null) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const stickyValue = window.localStorage.getItem(key);
    setValue(stickyValue !== null ? JSON.parse(stickyValue) : defaultValue);
  }, []);

  useEffect(() => {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
