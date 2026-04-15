import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ServerInfoState {
    version: string;
    setServerInfo: (version: string) => void;
}

export const serverInfoStore = create<ServerInfoState>()(
    persist(
        (set) => ({
            version: '1.0.0',
            setServerInfo: (version) => set({version}),
        }),
        {
            name: 'serverInfo',
            partialize: (state) => ({version: state.version}),
        }
    )
);
