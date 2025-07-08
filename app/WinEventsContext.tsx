import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface WinEvent {
  id: number;
  value: number;
  won: boolean;
  earliestWin: string;
}

interface WinEventsContextType {
  events: WinEvent[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const WinEventsContext = createContext<WinEventsContextType | undefined>(undefined);

export function useWinEvents() {
  const ctx = useContext(WinEventsContext);
  if (!ctx) throw new Error("useWinEvents must be used within a WinEventsProvider");
  return ctx;
}

export function WinEventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<WinEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = () => {
    setLoading(true);
    fetch("/api/winevents")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch win events");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <WinEventsContext.Provider value={{ events, loading, error, refresh: fetchEvents }}>
      {children}
    </WinEventsContext.Provider>
  );
}
