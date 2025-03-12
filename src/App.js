import React, { useEffect, useState } from 'react';
import { ChakraProvider, Box, VStack, HStack, Text, Heading, Spinner } from '@chakra-ui/react';
import useGeolocation from './hooks/useGeolocation';
import useAvatar from './hooks/useAvatar';
import useNearbyUsers from './hooks/useNearbyUsers';
import AvatarCreator from './components/AvatarCreator';
import AvatarViewer from './components/AvatarViewer';
import NearbyUsers from './components/NearbyUsers';
import InteractionPanel from './components/InteractionPanel';
import SavePanel from './components/SavePanel';
import { signInAnonymousUser } from './services/firebase';
import { getEncounterCount } from './utils/storage';

import { getDatabase, ref, set, get } from 'firebase/database';

function App() {
  
  // State
  const [activeTab, setActiveTab] = useState('nearby');
  const [selectedUser, setSelectedUser] = useState(null);
  const [encounterCount, setEncounterCount] = useState(0);
  
  // Get avatar data
  const { 
    avatarData, 
    loading: avatarLoading, 
    updateAvatar,
    getShareableUrl 
  } = useAvatar();
  
  // Only proceed with location and nearby users once avatar is loaded
  const { 
    location, 
    locationGrid, 
    loading: locationLoading, 
    error: locationError 
  } = useGeolocation();
  
  // Get nearby users if we have location and avatar data
  const { 
    nearbyUsers, 
    loading: usersLoading 
  } = useNearbyUsers(
    locationGrid, 
    avatarData && !avatarLoading ? { 
      ...avatarData,
      lastActive: new Date().toISOString() 
    } : null
  );

  useEffect(() => {
    const testFirebase = async () => {
      try {
        const db = getDatabase();
        const testRef = ref(db, 'test');
        await set(testRef, { timestamp: Date.now() });
        const snapshot = await get(testRef);
        console.log("Firebase test successful:", snapshot.val());
        return true;
      } catch (error) {
        console.error("Firebase test failed:", error);
        return false;
      }
    };

    testFirebase();
  }, []);
  
  // Authentication effect - this runs once on component mount
  useEffect(() => {
    const authenticate = async () => {
      try {
        await signInAnonymousUser();
        console.log("Authentication completed");
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };
    
    authenticate();
  }, []);
  
  // Update encounter count - only run when nearbyUsers is actually changed
  useEffect(() => {
    if (!usersLoading) {
      console.log("Updating encounter count");
      setEncounterCount(getEncounterCount());
    }
  }, [usersLoading, nearbyUsers]);
  
  // Periodic update interval - separate from the nearbyUsers dependency
  useEffect(() => {
    const interval = setInterval(() => {
      setEncounterCount(getEncounterCount());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle user selection for interaction
  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setActiveTab('interactions');
  };
  
  // Debug logs
  console.log("Avatar loading:", avatarLoading);
  console.log("Location loading:", locationLoading);
  console.log("Users loading:", usersLoading);
  console.log("Location grid:", locationGrid);
  console.log("Avatar data:", avatarData);
  
  // Loading state
  const [forceLoaded, setForceLoaded] = useState(false);
  const isLoading = (avatarLoading || locationLoading || usersLoading) && !forceLoaded;

  useEffect(() => {
    // Force progress after a short delay
    const forceTimeout = setTimeout(() => {
      setForceLoaded(true);
      console.log("Forcing app to loaded state");
    }, 8000); // 8 seconds
    
    return () => clearTimeout(forceTimeout);
  }, []);
  
  return (
    <ChakraProvider>
      <Box p={4} minHeight="100vh" bg="gray.50">
        {isLoading ? (
          <VStack spacing={4} align="center" justify="center" height="100vh">
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
            <Text>Loading your experience...</Text>
            <Text fontSize="sm" color="gray.500">
              {avatarLoading && "Loading avatar..."}
              {!avatarLoading && locationLoading && "Waiting for location..."}
              {!avatarLoading && !locationLoading && usersLoading && "Checking for nearby users..."}
            </Text>
          </VStack>
        ) : (
          <VStack spacing={4} align="stretch">
            {/* Header */}
            <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
              <Heading size="md">Oh Hey! - GDC StreetPass</Heading>
              <Text fontSize="sm" color="gray.500">
                Encounters: {encounterCount} | Nearby: {Object.keys(nearbyUsers || {}).length}
              </Text>
              {locationError && (
                <Text color="red.500" fontSize="sm">
                  Location error: {locationError.message}
                </Text>
              )}
            </Box>
            
            {/* Main Content */}
            <Box p={4} bg="white" borderRadius="md" boxShadow="sm" flex="1">
              {activeTab === 'nearby' && (
                <NearbyUsers 
                  users={nearbyUsers || {}} 
                  onSelectUser={handleUserSelect} 
                />
              )}
              
              {activeTab === 'customize' && (
                <AvatarCreator 
                  avatarData={avatarData} 
                  onUpdate={updateAvatar} 
                />
              )}
              
              {activeTab === 'interactions' && selectedUser && (
                <InteractionPanel 
                  userData={nearbyUsers?.[selectedUser] || {}} 
                  onBack={() => setActiveTab('nearby')} 
                />
              )}
            </Box>
            
            {/* Avatar Display */}
            <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
              <AvatarViewer 
                avatarData={avatarData}
                onCustomize={() => setActiveTab('customize')}
              />
            </Box>
            
            {/* Save Panel */}
            <SavePanel getShareableUrl={getShareableUrl} />
            
            {/* Tab Navigation */}
            <HStack as="nav" spacing={0} bg="white" borderRadius="md" overflow="hidden" boxShadow="sm">
              <Box 
                flex="1" 
                p={4} 
                bg={activeTab === 'nearby' ? 'blue.500' : 'white'}
                color={activeTab === 'nearby' ? 'white' : 'gray.800'}
                textAlign="center"
                cursor="pointer"
                onClick={() => setActiveTab('nearby')}
              >
                Nearby
              </Box>
              <Box 
                flex="1" 
                p={4} 
                bg={activeTab === 'customize' ? 'blue.500' : 'white'}
                color={activeTab === 'customize' ? 'white' : 'gray.800'}
                textAlign="center"
                cursor="pointer"
                onClick={() => setActiveTab('customize')}
              >
                Customize
              </Box>
            </HStack>
          </VStack>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;