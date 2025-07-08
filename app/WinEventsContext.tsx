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
  markEventWon: (id: number) => Promise<void>;
}

const WinEventsContext = createContext<WinEventsContextType | undefined>(undefined);

export function useWinEvents() {
  const ctx = useContext(WinEventsContext);
  if (!ctx) throw new Error("useWinEvents must be used within a WinEventsProvider");
  return ctx;
}

export function WinEventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<WinEvent[]>(() => {
    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('winevents');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = React.useCallback(() => {
    setLoading(true);
    fetch("/api/winevents")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch win events");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        // Update localStorage cache
        if (typeof window !== 'undefined') {
          localStorage.setItem('winevents', JSON.stringify(data));
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const markEventWon = async (id: number) => {
    // Mark the event as won and persist
    const updated = events.map(ev => ev.id === id ? { ...ev, won: true } : ev);
    setEvents(updated);
    // Update localStorage cache
    if (typeof window !== 'undefined') {
      localStorage.setItem('winevents', JSON.stringify(updated));
    }
    try {
      await fetch("/api/winevents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      setError("Failed to persist win event");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <WinEventsContext.Provider value={{ events, loading, error, refresh: fetchEvents, markEventWon }}>
      {children}
    </WinEventsContext.Provider>
  );
}
