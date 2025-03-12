import React, { useEffect, useState } from 'react';
import { ChakraProvider, Box, VStack, HStack, Text, Heading, Spinner } from '@chakra-ui/react';
import { useGeolocation } from './hooks/useGeolocation';
import { useAvatar } from './hooks/useAvatar';
import { useNearbyUsers } from './hooks/useNearbyUsers';
import AvatarCreator from './components/AvatarCreator';
import AvatarViewer from './components/AvatarViewer';
import NearbyUsers from './components/NearbyUsers';
import InteractionPanel from './components/InteractionPanel';
import SavePanel from './components/SavePanel';
import { signInAnonymousUser } from './services/firebase';
import { getEncounterCount } from './utils/storage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('nearby'); // 'nearby', 'customize', 'interactions'
  const [selectedUser, setSelectedUser] = useState(null);
  const [encounterCount, setEncounterCount] = useState(0);
  
  // Get avatar data
  const { 
    avatarData, 
    loading: avatarLoading, 
    updateAvatar,
    getShareableUrl 
  } = useAvatar();
  
  // Get location data
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
    avatarData && { 
      ...avatarData,
      lastActive: new Date().toISOString() 
    }
  );
  
  // Authentication effect
  useEffect(() => {
    const authenticate = async () => {
      const user = await signInAnonymousUser();
      setIsAuthenticated(user !== null);
    };
    
    authenticate();
  }, []);
  
  // Update encounter count effect
  useEffect(() => {
    setEncounterCount(getEncounterCount());
    
    // Update count every time nearby users change
    const interval = setInterval(() => {
      setEncounterCount(getEncounterCount());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [nearbyUsers]);
  
  // Handle user selection for interaction
  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setActiveTab('interactions');
  };
  
  // Loading state
  const isLoading = avatarLoading || locationLoading || usersLoading;
  
  return (
    <ChakraProvider>
      <Box p={4} minHeight="100vh" bg="gray.50">
        {isLoading ? (
          <VStack spacing={4} align="center" justify="center" height="100vh">
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
            <Text>Loading your experience...</Text>
          </VStack>
        ) : (
          <VStack spacing={4} align="stretch">
            {/* Header */}
            <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
              <Heading size="md">GDC StreetPass</Heading>
              <Text fontSize="sm" color="gray.500">
                Encounters: {encounterCount} | Nearby: {Object.keys(nearbyUsers).length}
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
                  users={nearbyUsers} 
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
                  userData={nearbyUsers[selectedUser]} 
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