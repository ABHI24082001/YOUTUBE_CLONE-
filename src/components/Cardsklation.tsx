import {Box, Center, HStack, Skeleton, VStack} from 'native-base';
import React, {useState, useEffect} from 'react';

const Cardsklation = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <Center w="100%" m={1}>
      <VStack
        w="100%"
        borderWidth="1"
        space={4}
        mt={2}
        overflow="hidden"
        rounded="md"
        _dark={{
          borderColor: 'coolGray.500',
        }}
        _light={{
          borderColor: 'coolGray.500',
        }}
        pb={4}>
        {[...Array(6)].map((_, index) => (
          <HStack
            alignItems={'center'}
            justifyContent={'space-evenly'}
            mx={2}
            key={index}>
            <Box
              borderRadius={10}
              borderColor={'gray.700'}
              alignItems={'center'}
              borderWidth={1}
              py={3}
              w="100%"
              mb={4}>
              {loading ? (
                <>
                  <Skeleton
                    w="90%"
                    h={200}
                    borderRadius={10}
                    startColor={'#000'}
                    endColor={'#333'}
                    m={2}
                  />
                  <Skeleton.Text
                    w="90%"
                    startColor={'#000'}
                    endColor={'#333'}
                    px="4"
                  />
                </>
              ) : (
                // Your actual content here after loading
                <Box w="90%" h={200} borderRadius={10} bg="#000" m={2} />
              )}
            </Box>
          </HStack>
        ))}
      </VStack>
    </Center>
  );
};

export default Cardsklation;
