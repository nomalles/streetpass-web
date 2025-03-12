import React from 'react';
import { Box, HStack, Text, Button, Avatar, VStack } from '@chakra-ui/react';

// Simple 2D version that doesn't require Three.js
// You can upgrade this to 3D later if needed
const AvatarViewer = ({ avatarData, onCustomize }) => {
  if (!avatarData) return null;
  
  // Generate initials from name
  const getInitials = () => {
    if (!avatarData.name) return '?';
    const nameParts = avatarData.name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Get accessory emoji
  const getAccessoryEmoji = () => {
    const accessories = ['', '👓', '🧢', '🎧', '😷'];
    return accessories[avatarData.accessory] || '';
  };
  
  // Get hair style icon
  const getHairStyleIcon = () => {
    const hairstyles = ['💇', '💇‍♀️', '👱‍♀️', '👩‍🦱', '👨‍🦲'];
    return hairstyles[avatarData.hairStyle] || '';
  };
  
  // Get name or default
  const getName = () => {
    return avatarData.name || 'Anonymous';
  };
  
  return (
    <HStack spacing={4} p={2} align="center">
      <Box position="relative">
        <Avatar 
          size="xl" 
          name={getInitials()}
          bg={avatarData.skinColor}
          color="white"
        />
        {/* Show accessory as an overlay */}
        {avatarData.accessory > 0 && (
          <Text
            position="absolute"
            top="-5px"
            right="-5px"
            fontSize="xl"
          >
            {getAccessoryEmoji()}
          </Text>
        )}
        {/* Show hair style as an overlay */}
        {avatarData.hairStyle > 0 && (
          <Text
            position="absolute"
            top="-12px"
            left="-5px"
            fontSize="xl"
          >
            {getHairStyleIcon()}
          </Text>
        )}
      </Box>
      
      <VStack align="start" spacing={0} flex="1">
        <Text fontWeight="bold" fontSize="md">{getName()}</Text>
        <Text fontSize="sm" color="gray.500">Your Avatar</Text>
      </VStack>
      
      <Button 
        size="sm" 
        colorScheme="blue" 
        variant="outline"
        onClick={onCustomize}
      >
        Edit
      </Button>
    </HStack>
  );
};

export default AvatarViewer;
