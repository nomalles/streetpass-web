import React from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Avatar, 
  Heading, 
  Button,
  Divider,
  Badge
} from '@chakra-ui/react';

const NearbyUsers = ({ users, onSelectUser }) => {
  const usersList = Object.entries(users);
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Get accessory emoji
  const getAccessoryEmoji = (accessoryIndex) => {
    const accessories = ['', '👓', '🧢', '🎧', '😷'];
    return accessories[accessoryIndex] || '';
  };
  
  // Format time since last active
  const getTimeSince = (timestamp) => {
    if (!timestamp) return 'unknown';
    
    const now = new Date();
    const lastActive = new Date(timestamp);
    const diffSeconds = Math.floor((now - lastActive) / 1000);
    
    if (diffSeconds < 60) {
      return 'just now';
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes} min ago`;
    } else {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours} hours ago`;
    }
  };
  
  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Heading size="md">Nearby People ({usersList.length})</Heading>
      </HStack>
      
      {usersList.length === 0 ? (
        <Box 
          p={8} 
          textAlign="center" 
          borderRadius="md" 
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="gray.200"
        >
          <Text color="gray.500">
            No one nearby right now. Maybe try moving around the conference?
          </Text>
        </Box>
      ) : (
        <VStack spacing={2} align="stretch">
          {usersList.map(([userId, userData]) => (
            <Box 
              key={userId}
              p={3}
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.200"
              _hover={{ bg: 'gray.50' }}
            >
              <HStack spacing={3}>
                <Box position="relative">
                  <Avatar 
                    size="md" 
                    name={getInitials(userData.name)}
                    bg={userData.skinColor || 'gray.400'}
                  />
                  {userData.accessory > 0 && (
                    <Text
                      position="absolute"
                      top="-5px"
                      right="-5px"
                      fontSize="md"
                    >
                      {getAccessoryEmoji(userData.accessory)}
                    </Text>
                  )}
                </Box>
                
                <VStack align="start" spacing={0} flex="1">
                  <Text fontWeight="bold">
                    {userData.name || 'Anonymous User'}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Last active: {getTimeSince(userData.lastActive)}
                  </Text>
                </VStack>
                
                <Button 
                  size="sm" 
                  colorScheme="blue"
                  onClick={() => onSelectUser(userId)}
                >
                  Interact
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default NearbyUsers;
