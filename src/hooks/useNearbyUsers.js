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
      console.log("No location grid or user data yet, skipping nearby users fetch");
      return;
    }
    
    console.log("Setting up nearby users for grid:", locationGrid);
    setLoading(true);
    
    // Get current Firebase user
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      console.log("No authenticated user found");
      setError(new Error('User not authenticated'));
      setLoading(false);
      return;
    }
    
    const userId = currentUser.uid;
    console.log("Current user ID:", userId);
    
    // Add current user to this location
    console.log("Adding user to location:", locationGrid);
    addUserToLocation(userId, locationGrid, userData)
      .then(() => {
        console.log("Successfully added user to location");
      })
      .catch(error => {
        console.error('Error adding user to location:', error);
        setError(error);
      });
    
    // Set a safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      console.log("Safety timeout triggered - forcing loading to complete");
      setLoading(false);
      setNearbyUsers({}); // Initialize with empty object
    }, 5000); // 5 seconds timeout
    
    // Listen for other users in this location
    console.log("Setting up listener for nearby users");
    const unsubscribe = listenForNearbyUsers(locationGrid, (users) => {
      console.log("Received nearby users callback with data:", users);
      
      // Cancel the safety timeout since we got a response
      clearTimeout(safetyTimeout);
      
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
      console.log("Cleaning up nearby users listener");
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, [locationGrid, userData]);
  
  return { nearbyUsers, loading, error };
};

export default useNearbyUsers;