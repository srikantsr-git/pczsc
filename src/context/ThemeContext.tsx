import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeConfig, PresetThemeId } from '../types/theme';
import { PRESET_THEMES } from '../utils/themePresets';
import {
  applyThemeCssVariables,
  exportThemeJson,
  validateThemeJson
} from '../utils/themeEngine';
import { safeSaveStorage, safeLoadStorage } from '../utils/persistentStorage';
import { fetchSiteSettingFromDB, saveSiteSettingToDB } from '../utils/neonDB';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  draftTheme: ThemeConfig;
  savedThemes: ThemeConfig[];
  history: ThemeConfig[];
  historyIndex: number;
  isCompareMode: boolean;
  isPublished: boolean;
  canUndo: boolean;
  canRedo: boolean;
  // Theme Action Methods
  applyPreset: (presetId: PresetThemeId) => void;
  updateTheme: (updater: (prev: ThemeConfig) => ThemeConfig) => void;
  saveTheme: (name?: string) => void;
  duplicateTheme: () => void;
  resetTheme: () => void;
  importThemeJson: (jsonStr: string) => boolean;
  exportThemeJsonString: () => string;
  publishTheme: () => void;
  undo: () => void;
  redo: () => void;
  toggleCompareMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedThemes, setSavedThemes] = useState<ThemeConfig[]>(() => {
    const saved = localStorage.getItem('pczsc_custom_themes');
    return saved ? JSON.parse(saved) : Object.values(PRESET_THEMES);
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('pczsc_active_theme');
    return saved ? JSON.parse(saved) : PRESET_THEMES['default-light'];
  });

  const [draftTheme, setDraftTheme] = useState<ThemeConfig>(currentTheme);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<ThemeConfig[]>([currentTheme]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [isCompareMode, setIsCompareMode] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Apply CSS variables to DOM on draft change for live preview
  // AND auto-persist the draft so it survives restarts without needing Publish
  useEffect(() => {
    applyThemeCssVariables(draftTheme);
    safeSaveStorage('pczsc_active_theme', draftTheme);
    saveSiteSettingToDB('pczsc_active_theme', draftTheme);
  }, [draftTheme]);

  // Apply the saved theme immediately on first mount and sync from Neon DB
  useEffect(() => {
    applyThemeCssVariables(currentTheme);
    async function syncDBTheme() {
      try {
        const localTheme = safeLoadStorage<ThemeConfig | null>('pczsc_active_theme', null);
        const dbTheme = await fetchSiteSettingFromDB<ThemeConfig | null>('pczsc_active_theme', null);

        if (dbTheme && dbTheme.primaryColors) {
          const dbTime = new Date(dbTheme.updatedAt || 0).getTime();
          const localTime = new Date(localTheme?.updatedAt || 0).getTime();

          if (!localTheme || dbTime >= localTime) {
            setCurrentTheme(dbTheme);
            setDraftTheme(dbTheme);
            applyThemeCssVariables(dbTheme);
            safeSaveStorage('pczsc_active_theme', dbTheme);
          } else if (localTheme && localTheme.primaryColors) {
            // Local theme is newer than DB theme -> sync local theme to DB
            saveSiteSettingToDB('pczsc_active_theme', localTheme);
          }
        } else if (localTheme && localTheme.primaryColors) {
          // DB has no theme -> push local theme to DB
          saveSiteSettingToDB('pczsc_active_theme', localTheme);
        }
      } catch (err) {
        console.warn('Theme DB sync warning:', err);
      }
    }
    syncDBTheme();
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const pushHistory = (newTheme: ThemeConfig) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTheme);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const updateTheme = (updater: (prev: ThemeConfig) => ThemeConfig) => {
    setDraftTheme((prev) => {
      const next = updater(prev);
      next.updatedAt = new Date().toISOString();
      pushHistory(next);
      setIsPublished(false);
      return next;
    });
  };

  const applyPreset = (presetId: PresetThemeId) => {
    const preset = PRESET_THEMES[presetId];
    if (preset) {
      const updated: ThemeConfig = {
        ...preset,
        id: preset.id || `preset-${presetId}`,
        name: preset.name,
        presetId: presetId,
        updatedAt: new Date().toISOString()
      };
      setDraftTheme(updated);
      pushHistory(updated);
      setIsPublished(false);
      applyThemeCssVariables(updated);
    }
  };

  const saveTheme = (customName?: string) => {
    const themeToSave: ThemeConfig = {
      ...draftTheme,
      id: draftTheme.id || `custom-${Date.now()}`,
      name: customName || draftTheme.name || 'My Custom Theme',
      updatedAt: new Date().toISOString()
    };
    const updatedList = [
      themeToSave,
      ...savedThemes.filter((t) => t.id !== themeToSave.id)
    ];
    setSavedThemes(updatedList);
    safeSaveStorage('pczsc_custom_themes', updatedList);
  };

  const duplicateTheme = () => {
    const duplicated: ThemeConfig = {
      ...draftTheme,
      id: `copy-${Date.now()}`,
      name: `${draftTheme.name} (Copy)`,
      updatedAt: new Date().toISOString()
    };
    setDraftTheme(duplicated);
    pushHistory(duplicated);
    setIsPublished(false);
  };

  const resetTheme = () => {
    const defaultTheme = PRESET_THEMES['default-light'];
    setDraftTheme(defaultTheme);
    setCurrentTheme(defaultTheme);
    pushHistory(defaultTheme);
    setIsPublished(true);
    safeSaveStorage('pczsc_active_theme', defaultTheme);
  };

  const importThemeJson = (jsonStr: string): boolean => {
    const parsed = validateThemeJson(jsonStr);
    if (parsed) {
      setDraftTheme(parsed);
      pushHistory(parsed);
      setIsPublished(false);
      return true;
    }
    return false;
  };

  const exportThemeJsonString = (): string => {
    return exportThemeJson(draftTheme);
  };

  const publishTheme = () => {
    setCurrentTheme(draftTheme);
    setIsPublished(true);
    safeSaveStorage('pczsc_active_theme', draftTheme);
    saveSiteSettingToDB('pczsc_active_theme', draftTheme);
  };

  const undo = () => {
    if (canUndo) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setDraftTheme(history[prevIndex]);
    }
  };

  const redo = () => {
    if (canRedo) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setDraftTheme(history[nextIndex]);
    }
  };

  const toggleCompareMode = () => {
    setIsCompareMode((prev) => !prev);
  };

  const setDarkMode = (isDark: boolean) => {
    updateTheme((prev) => ({
      ...prev,
      darkMode: {
        ...prev.darkMode,
        mode: isDark ? 'dark' : 'light',
        isDark
      }
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        draftTheme,
        savedThemes,
        history,
        historyIndex,
        isCompareMode,
        isPublished,
        canUndo,
        canRedo,
        applyPreset,
        updateTheme,
        saveTheme,
        duplicateTheme,
        resetTheme,
        importThemeJson,
        exportThemeJsonString,
        publishTheme,
        undo,
        redo,
        toggleCompareMode,
        setDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
