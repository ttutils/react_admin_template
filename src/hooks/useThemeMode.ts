import {useSyncExternalStore} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = Exclude<ThemeMode, 'system'>;

interface ThemeSnapshot {
    themeMode: ThemeMode;
    resolvedTheme: ResolvedTheme;
}

const THEME_STORAGE_KEY = 'theme-mode';
const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';
const listeners = new Set<() => void>();
const canUseDOM = typeof window !== 'undefined' && typeof document !== 'undefined';

const isThemeMode = (value: string | null): value is ThemeMode => (
    value === 'light' || value === 'dark' || value === 'system'
);

const readStoredThemeMode = (): ThemeMode => {
    if (!canUseDOM) return 'system';
    try {
        const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
        return isThemeMode(storedMode) ? storedMode : 'system';
    } catch {
        return 'system';
    }
};

const resolveTheme = (themeMode: ThemeMode): ResolvedTheme => {
    if (themeMode !== 'system') return themeMode;
    if (!canUseDOM) return 'light';
    return window.matchMedia(DARK_MODE_QUERY).matches ? 'dark' : 'light';
};

let snapshot: ThemeSnapshot = {themeMode: readStoredThemeMode(), resolvedTheme: 'light'};
snapshot = {...snapshot, resolvedTheme: resolveTheme(snapshot.themeMode)};

const applyResolvedTheme = (resolvedTheme: ResolvedTheme) => {
    if (!canUseDOM) return;
    const applyToBody = () => {
        if (resolvedTheme === 'dark') document.body.setAttribute('theme-mode', 'dark');
        else document.body.removeAttribute('theme-mode');
    };
    if (document.body) applyToBody();
    else document.addEventListener('DOMContentLoaded', () => applyResolvedTheme(snapshot.resolvedTheme), {once: true});
};

const updateSnapshot = (themeMode: ThemeMode) => {
    const nextSnapshot: ThemeSnapshot = {themeMode, resolvedTheme: resolveTheme(themeMode)};
    const hasChanged = nextSnapshot.themeMode !== snapshot.themeMode
        || nextSnapshot.resolvedTheme !== snapshot.resolvedTheme;
    snapshot = nextSnapshot;
    applyResolvedTheme(snapshot.resolvedTheme);
    if (hasChanged) listeners.forEach(listener => listener());
};

export const setThemeMode = (themeMode: ThemeMode) => {
    if (canUseDOM) {
        try { window.localStorage.setItem(THEME_STORAGE_KEY, themeMode); } catch { /* storage is optional */ }
    }
    updateSnapshot(themeMode);
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};
const getSnapshot = () => snapshot;

if (canUseDOM) {
    applyResolvedTheme(snapshot.resolvedTheme);
    const colorSchemeQuery = window.matchMedia(DARK_MODE_QUERY);
    colorSchemeQuery.addEventListener('change', () => {
        if (snapshot.themeMode === 'system') updateSnapshot('system');
    });
    window.addEventListener('storage', event => {
        if (event.key === THEME_STORAGE_KEY || event.key === null) updateSnapshot(readStoredThemeMode());
    });
}

export const useThemeMode = () => {
    const themeSnapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    return {...themeSnapshot, isDark: themeSnapshot.resolvedTheme === 'dark', setThemeMode};
};
