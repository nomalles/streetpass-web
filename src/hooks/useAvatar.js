import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  getAvatarData,
  saveAvatarData,
  getUserId,
  saveUserId,
  extractUserIdFromUrl
} from '../utils/storage';
import { 
  updateUserAvatar,
  getCurrentUser
} from '../services/firebase';

// Default avatar options
const defaultAvatarData = {
  name: '',
  skinColor: '#E0AC69', // Default skin tone
  hairStyle: 0,
  hairColor: '#3D2314', // Default hair color
  accessory: 0,
  created: new Date().toISOString()
};

const useAvatar = () => {
  const [avatarData, setAvatarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  
  // Initialize avatar data
  useEffect(() => {
    const initAvatar = async () => {
      try {
        setLoading(true);
        
        // Check if there's a user ID in the URL (shared link)
        const urlUserId = extractUserIdFromUrl();
        
        // Check if we have locally stored avatar data
        let storedAvatar = getAvatarData();
        let storedUserId = getUserId();
        
        // If we have a URL user ID, try to use that, otherwise use stored or generate new
        const finalUserId = urlUserId || storedUserId || uuidv4();
        
        // If we got the ID from URL but don't have local data, we need to fetch from Firebase
        if (urlUserId && (!storedAvatar || urlUserId !== storedUserId)) {
          // TODO: Fetch avatar data from Firebase based on user ID
          // This would be implemented if we add server-side persistence
          storedAvatar = defaultAvatarData;
        }
        
        // If we still don't have avatar data, use defaults
        if (!storedAvatar) {
          storedAvatar = defaultAvatarData;
        }
        
        // Save user ID locally if it's new
        if (!storedUserId || urlUserId) {
          saveUserId(finalUserId);
        }
        
        setAvatarData(storedAvatar);
        setUserId(finalUserId);
        setLoading(false);
      } catch (err) {
        console.error("Error initializing avatar:", err);
        setError(err);
        setLoading(false);
      }
    };
    
    initAvatar();
  }, []);
  
  // Update avatar data
  const updateAvatar = async (newData) => {
    try {
      const updatedData = {
        ...avatarData,
        ...newData,
        lastUpdated: new Date().toISOString()
      };
      
      // Save locally
      saveAvatarData(updatedData);
      setAvatarData(updatedData);
      
      // If the user is authenticated, save to Firebase too
      const currentUser = getCurrentUser();
      if (currentUser) {
        await updateUserAvatar(currentUser.uid, updatedData);
      }
      
      return true;
    } catch (err) {
      console.error("Error updating avatar:", err);
      setError(err);
      return false;
    }
  };
  
  // Generate a shareable URL for this avatar
  const getShareableUrl = () => {
    if (!userId) return null;
    
    const baseUrl = window.location.origin;
    return `${baseUrl}?user=${userId}`;
  };
  
  return { 
    avatarData, 
    loading, 
    error, 
    userId,
    updateAvatar,
    getShareableUrl
  };
};

export default useAvatar;