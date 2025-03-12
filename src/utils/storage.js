// Keys for local storage
const KEYS = {
  AVATAR_DATA: 'streetpass_avatar_data',
  USER_ID: 'streetpass_user_id',
  ENCOUNTERS: 'streetpass_encounters',
};

// Save avatar data to local storage
export const saveAvatarData = (avatarData) => {
  try {
    localStorage.setItem(KEYS.AVATAR_DATA, JSON.stringify(avatarData));
    return true;
  } catch (error) {
    console.error('Error saving avatar data:', error);
    return false;
  }
};

// Get avatar data from local storage
export const getAvatarData = () => {
  try {
    const data = localStorage.getItem(KEYS.AVATAR_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving avatar data:', error);
    return null;
  }
};

// Save user ID to local storage
export const saveUserId = (userId) => {
  try {
    localStorage.setItem(KEYS.USER_ID, userId);
    return true;
  } catch (error) {
    console.error('Error saving user ID:', error);
    return false;
  }
};

// Get user ID from local storage
export const getUserId = () => {
  try {
    return localStorage.getItem(KEYS.USER_ID);
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return null;
  }
};

// Save encounter with another user
export const saveEncounter = (userId, userData) => {
  try {
    const encounters = getEncounters();
    encounters[userId] = {
      ...userData,
      firstMet: userData.firstMet || new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      meetCount: (encounters[userId]?.meetCount || 0) + 1,
    };
    localStorage.setItem(KEYS.ENCOUNTERS, JSON.stringify(encounters));
    return true;
  } catch (error) {
    console.error('Error saving encounter:', error);
    return false;
  }
};

// Get all encounters
export const getEncounters = () => {
  try {
    const data = localStorage.getItem(KEYS.ENCOUNTERS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error retrieving encounters:', error);
    return {};
  }
};

// Get total unique encounter count
export const getEncounterCount = () => {
  try {
    const encounters = getEncounters();
    return Object.keys(encounters).length;
  } catch (error) {
    console.error('Error counting encounters:', error);
    return 0;
  }
};

// Generate a shareable URL with user ID embedded
export const generateShareableUrl = (userId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}?user=${userId}`;
};

// Extract user ID from URL if present
export const extractUserIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('user');
};

// Clear all data (for testing/reset)
export const clearAllData = () => {
  try {
    localStorage.removeItem(KEYS.AVATAR_DATA);
    localStorage.removeItem(KEYS.USER_ID);
    localStorage.removeItem(KEYS.ENCOUNTERS);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
