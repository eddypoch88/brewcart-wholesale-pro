import React, { createContext, useContext } from 'react';
import { StoreSettings } from '../types';
import { getSettings } from '../lib/storage';

// Seed mock data on first load - Deprecated with Supabase
// seedIfNeeded();

interface StoreContextType {
    settings: StoreSettings;
    reload: () => void;
}

const StoreContext = createContext<StoreContextType>({
    settings: getSettings(),
    reload: () => { },
});

export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = React.useState<StoreSettings>(getSettings());

    const reload = () => setSettings(getSettings());

    return (
        <StoreContext.Provider value={{ settings, reload }}>
            {children}
        </StoreContext.Provider>
    );
}
