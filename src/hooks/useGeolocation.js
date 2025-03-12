import { useState, useEffect } from 'react';
import { 
  isGeolocationAvailable, 
  watchPosition, 
  clearWatch, 
  getLocationGridId 
} from '../services/geolocation';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationGrid, setLocationGrid] = useState(null);
  
  useEffect(() => {
    if (!isGeolocationAvailable()) {
      setError(new Error('Geolocation is not supported by your browser'));
      setLoading(false);
      return;
    }
    
    // Success handler for geolocation watch
    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      
      // Update location state
      setLocation({
        latitude,
        longitude,
        accuracy,
        timestamp: position.timestamp
      });
      
      // Calculate grid ID for proximity grouping
      const gridId = getLocationGridId(latitude, longitude);
      setLocationGrid(gridId);
      
      setLoading(false);
    };
    
    // Error handler for geolocation watch
    const handleError = (error) => {
      setError(error);
      setLoading(false);
    };
    
    // Start watching position
    const watchId = watchPosition(handleSuccess, handleError, options);
    
    // Clean up on unmount
    return () => {
      clearWatch(watchId);
    };
  }, [options]);
  
  return { location, locationGrid, error, loading };
};

export default useGeolocation;