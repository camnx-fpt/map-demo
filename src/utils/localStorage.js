/**
 * LocalStorage Helper Functions
 * Handle persistence of simulation settings
 */

const STORAGE_KEY = 'ems_simulation_settings';

/**
 * Save settings to localStorage
 * @param {Object} settings - Settings object to save
 */
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
};

/**
 * Load settings from localStorage
 * @param {Object} defaults - Default settings to use if none saved
 * @returns {Object} Loaded settings or defaults
 */
export const loadSettings = (defaults) => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure all keys exist
      return { ...defaults, ...parsed };
    }
    return defaults;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaults;
  }
};

/**
 * Clear saved settings
 */
export const clearSettings = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear settings:', error);
    return false;
  }
};
