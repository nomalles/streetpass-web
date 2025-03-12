import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  onDisconnect 
} from 'firebase/database';

// Your web app's Firebase configuration
// Replace these with your Firebase project values
const firebaseConfig = {
  apiKey: "AIzaSyD3Op0LTdW9Dq1u1mc_3StyVryATMdEKpc",
  authDomain: "streetpass-web.firebaseapp.com",
  projectId: "streetpass-web",
  storageBucket: "streetpass-web.firebasestorage.app",
  messagingSenderId: "162492502670",
  appId: "1:162492502670:web:3ddd023bd35421ca562fdf",
  measurementId: "G-H0CDB6RH90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Sign in anonymously
export const signInAnonymousUser = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("Error signing in anonymously:", error);
    return null;
  }
};

// Listen for auth state changes
export const listenForAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Update user's avatar data
export const updateUserAvatar = async (userId, avatarData) => {
  try {
    await set(ref(database, `users/${userId}/avatar`), avatarData);
    return true;
  } catch (error) {
    console.error("Error updating avatar:", error);
    return false;
  }
};

// Update user's location and online status
export const updateUserLocation = async (userId, locationData) => {
  try {
    const userLocationRef = ref(database, `users/${userId}/location`);
    await set(userLocationRef, {
      ...locationData,
      lastUpdated: new Date().toISOString(),
      online: true
    });
    
    // Set up disconnect hook to mark user as offline when they leave
    onDisconnect(userLocationRef).update({
      online: false,
      lastSeen: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error("Error updating location:", error);
    return false;
  }
};

// Get nearby users based on location grid
export const listenForNearbyUsers = (locationId, callback) => {
  const nearbyUsersRef = ref(database, `locations/${locationId}/users`);
  return onValue(nearbyUsersRef, (snapshot) => {
    const nearbyUsers = snapshot.exists() ? snapshot.val() : {};
    callback(nearbyUsers);
  });
};

// Add user to a location grid
export const addUserToLocation = async (userId, locationId, userData) => {
  try {
    // Add to location's user list
    await set(ref(database, `locations/${locationId}/users/${userId}`), userData);
    
    // Save location ID to user's data
    await set(ref(database, `users/${userId}/currentLocation`), locationId);
    
    // Remove user from this location when they disconnect
    onDisconnect(ref(database, `locations/${locationId}/users/${userId}`)).remove();
    
    return true;
  } catch (error) {
    console.error("Error adding user to location:", error);
    return false;
  }
};

export { auth, database };
