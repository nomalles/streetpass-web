import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Text, 
  Input, 
  HStack,
  useToast,
  useClipboard,
  Collapse
} from '@chakra-ui/react';

const SavePanel = ({ getShareableUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const shareableUrl = getShareableUrl ? getShareableUrl() : null;
  const { hasCopied, onCopy } = useClipboard(shareableUrl || '');
  const toast = useToast();
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My GDC StreetPass Avatar',
        text: 'Check out my avatar in the GDC StreetPass app!',
        url: shareableUrl,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      onCopy();
      toast({
        title: 'Link copied to clipboard!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleSaveToHome = () => {
    toast({
      title: 'Add to Home Screen',
      description: 'Look for "Add to Home Screen" option in your browser menu!',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
    setIsOpen(false);
  };
  
  return (
    <Box p={4} bg="blue.50" borderRadius="md">
      <HStack justify="space-between">
        <Text fontWeight="medium">Save your avatar for later</Text>
        <Button 
          size="sm" 
          colorScheme="blue"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close' : 'Save Options'}
        </Button>
      </HStack>
      
      <Collapse in={isOpen} animateOpacity>
        <Box mt={4} p={4} bg="white" borderRadius="md" borderWidth="1px">
          <Text mb={3}>
            Save your avatar to use it again later or on another device:
          </Text>
          
          {shareableUrl && (
            <>
              <HStack mb={4}>
                <Input value={shareableUrl} isReadOnly />
                <Button onClick={handleShare}>
                  {hasCopied ? 'Copied!' : 'Share'}
                </Button>
              </HStack>
              
              <Text fontSize="sm" mb={2}>
                Options:
              </Text>
              
              <Button 
                w="100%" 
                mb={2} 
                onClick={handleSaveToHome}
                size="sm"
              >
                Add to Home Screen
              </Button>
              
              <Button 
                w="100%" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.open('mailto:?subject=My GDC StreetPass Avatar&body=' + 
                    encodeURIComponent('Check out my avatar: ' + shareableUrl)
                  );
                }}
              >
                Email Link to Myself
              </Button>
            </>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default SavePanel;
