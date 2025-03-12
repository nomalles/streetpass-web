import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  Avatar, 
  Heading,
  Grid,
  Badge
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';

// Emoji reactions
const reactions = [
  { emoji: '👋', label: 'Wave' },
  { emoji: '😊', label: 'Smile' },
  { emoji: '👍', label: 'Thumbs Up' },
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '💬', label: 'Chat' },
  { emoji: '🔄', label: 'Connect' }
];

// Greetings
const greetings = [
  "Hi there!",
  "Hello from GDC!",
  "Nice to meet you!",
  "Let's connect!",
  "Game on!",
  "Looking to network?"
];

const InteractionPanel = ({ userData, onBack }) => {
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [selectedGreeting, setSelectedGreeting] = useState(null);
  
  if (!userData) {
    return (
      <VStack spacing={4} align="stretch">
        <Button leftIcon={<ChevronLeftIcon />} variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Text>User not found or has left the area.</Text>
      </VStack>
    );
  }
  
  // Get initials from name
  const getInitials = () => {
    if (!userData.name) return '?';
    const nameParts = userData.name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Get accessory emoji
  const getAccessoryEmoji = () => {
    const accessories = ['', '👓', '🧢', '🎧', '😷'];
    return accessories[userData.accessory] || '';
  };
  
  const handleReaction = (index) => {
    setSelectedReaction(index);
    alert(`Sent ${reactions[index].emoji} to ${userData.name || 'Anonymous'}`);
  };
  
  const handleGreeting = (index) => {
    setSelectedGreeting(index);
    alert(`Sent "${greetings[index]}" to ${userData.name || 'Anonymous'}`);
  };
  
  return (
    <VStack spacing={4} align="stretch">
      <Button leftIcon={<ChevronLeftIcon />} variant="ghost" onClick={onBack}>
        Back
      </Button>
      
      <Box 
        p={4} 
        borderRadius="md" 
        borderWidth="1px" 
        borderColor="gray.200"
        bg="gray.50"
      >
        <HStack spacing={4}>
          <Box position="relative">
            <Avatar 
              size="xl" 
              name={getInitials()}
              bg={userData.skinColor || 'gray.400'}
            />
            {userData.accessory > 0 && (
              <Text
                position="absolute"
                top="-5px"
                right="-5px"
                fontSize="xl"
              >
                {getAccessoryEmoji()}
              </Text>
            )}
          </Box>
          
          <VStack align="start" spacing={1}>
            <Heading size="md">{userData.name || 'Anonymous User'}</Heading>
            <Badge colorScheme="green">Nearby</Badge>
          </VStack>
        </HStack>
      </Box>
      
      <Box>
        <Heading size="sm" mb={2}>Send a Reaction</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
          {reactions.map((reaction, index) => (
            <Button 
              key={index}
              height="60px"
              fontSize="24px"
              variant={selectedReaction === index ? "solid" : "outline"}
              colorScheme={selectedReaction === index ? "blue" : "gray"}
              onClick={() => handleReaction(index)}
            >
              {reaction.emoji}
            </Button>
          ))}
        </Grid>
      </Box>
      
      <Box>
        <Heading size="sm" mb={2}>Send a Greeting</Heading>
        <VStack spacing={2} align="stretch">
          {greetings.map((greeting, index) => (
            <Button 
              key={index}
              variant={selectedGreeting === index ? "solid" : "outline"}
              colorScheme={selectedGreeting === index ? "blue" : "gray"}
              justifyContent="flex-start"
              onClick={() => handleGreeting(index)}
            >
              {greeting}
            </Button>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};

export default InteractionPanel;
