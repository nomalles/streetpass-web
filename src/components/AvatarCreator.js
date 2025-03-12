import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Button, 
  Input, 
  FormControl, 
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb
} from '@chakra-ui/react';

// Hair styles and accessories options
const hairStyles = ['Short', 'Medium', 'Long', 'Curly', 'Bald'];
const accessories = ['None', 'Glasses', 'Hat', 'Headphones', 'Mask'];

const AvatarCreator = ({ avatarData, onUpdate }) => {
  const [name, setName] = useState(avatarData.name || '');
  const [skinColor, setSkinColor] = useState(avatarData.skinColor || '#E0AC69');
  const [hairStyle, setHairStyle] = useState(avatarData.hairStyle || 0);
  const [hairColor, setHairColor] = useState(avatarData.hairColor || '#3D2314');
  const [accessory, setAccessory] = useState(avatarData.accessory || 0);
  
  // Save all changes
  const handleSave = () => {
    onUpdate({
      name,
      skinColor,
      hairStyle,
      hairColor,
      accessory
    });
  };
  
  // Cycle through options
  const cycleHairStyle = () => {
    setHairStyle((current) => (current + 1) % hairStyles.length);
  };
  
  const cycleAccessory = () => {
    setAccessory((current) => (current + 1) % accessories.length);
  };
  
  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">Customize Your Avatar</Heading>
      
      <FormControl>
        <FormLabel>Your Name</FormLabel>
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
        />
      </FormControl>
      
      <FormControl>
        <FormLabel>Skin Tone</FormLabel>
        <HStack>
          <input 
            type="color" 
            value={skinColor}
            onChange={(e) => setSkinColor(e.target.value)}
            style={{ width: '40px', height: '40px' }}
          />
          <Box 
            bg={skinColor} 
            w="40px" 
            h="40px" 
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
          />
        </HStack>
      </FormControl>
      
      <FormControl>
        <FormLabel>Hair Style: {hairStyles[hairStyle]}</FormLabel>
        <Button onClick={cycleHairStyle} w="100%">
          Change Hair Style
        </Button>
      </FormControl>
      
      <FormControl>
        <FormLabel>Hair Color</FormLabel>
        <HStack>
          <input 
            type="color" 
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
            style={{ width: '40px', height: '40px' }}
          />
          <Box 
            bg={hairColor} 
            w="40px" 
            h="40px" 
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
          />
        </HStack>
      </FormControl>
      
      <FormControl>
        <FormLabel>Accessory: {accessories[accessory]}</FormLabel>
        <Button onClick={cycleAccessory} w="100%">
          Change Accessory
        </Button>
      </FormControl>
      
      <Button 
        colorScheme="blue" 
        size="lg" 
        onClick={handleSave}
        mt={4}
      >
        Save Avatar
      </Button>
    </VStack>
  );
};

export default AvatarCreator;
