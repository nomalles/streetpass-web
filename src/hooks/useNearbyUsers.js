import { useState, useEffect } from 'react';
import { 
  listenForNearbyUsers, 
  addUserToLocation,
  getCurrentUser 
} from '../services/firebase';
import { saveEncounter } from '../utils/storage';

const useNearbyUsers = (locationGrid, userData) => {
  const [nearbyUsers, setNearbyUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Skip if we don't have location data yet or user data
    if (!locationGrid || !userData) {
      return;
    }
    
    setLoading(true);
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      setError(new Error('User not authenticated'));
      setLoading(false);
      return;
    }
    
    const userId = currentUser.uid;
    
    // Add current user to this location
    const addUserPromise = addUserToLocation(userId, locationGrid, userData);
    
    addUserPromise.catch(error => {
      console.error('Error adding user to location:', error);
      setError(error);
    });
    
    // Listen for other users in this location
    const unsubscribe = listenForNearbyUsers(locationGrid, (users) => {
      // Filter out the current user from nearby users
      const otherUsers = { ...users };
      delete otherUsers[userId];
      
      setNearbyUsers(otherUsers);
      setLoading(false);
      
      // Save encounters in local storage
      Object.entries(otherUsers).forEach(([otherUserId, otherUserData]) => {
        saveEncounter(otherUserId, otherUserData);
      });
    });
    
    // Clean up on unmount or when location changes
    return () => {
      unsubscribe();
    };
  }, [locationGrid, userData]);
  
  return { nearbyUsers, loading, error };
};

export default useNearbyUsers;