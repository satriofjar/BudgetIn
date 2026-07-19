"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface DataRefreshContextValue {
  refreshKey: number;
  bump: () => void;
}

const DataRefreshContext = createContext<DataRefreshContextValue>({
  refreshKey: 0,
  bump: () => {},
});

export function DataRefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <DataRefreshContext.Provider value={{ refreshKey, bump }}>
      {children}
    </DataRefreshContext.Provider>
  );
}

export function useDataRefresh() {
  return useContext(DataRefreshContext);
}
