// Check if geolocation is available in the browser
export const isGeolocationAvailable = () => {
  return "geolocation" in navigator;
};

// Get current position as a promise
export const getCurrentPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isGeolocationAvailable()) {
      reject(new Error("Geolocation is not available in this browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options
      }
    );
  });
};

// Watch position with continuous updates
export const watchPosition = (successCallback, errorCallback, options = {}) => {
  if (!isGeolocationAvailable()) {
    errorCallback(new Error("Geolocation is not available in this browser"));
    return null;
  }
  
  return navigator.geolocation.watchPosition(
    successCallback,
    errorCallback,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options
    }
  );
};

// Clear position watch
export const clearWatch = (watchId) => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
};

// Convert latitude and longitude to a grid cell ID
// This groups nearby users together based on proximity
export const getLocationGridId = (latitude, longitude, gridSize = 0.0001) => {
  // ~11m grid size at equator (adjust as needed for your proximity requirements)
  const latCell = Math.floor(latitude / gridSize);
  const lonCell = Math.floor(longitude / gridSize);
  return `${latCell}_${lonCell}`;
};

// Calculate distance between two points (in meters)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in meters
};
