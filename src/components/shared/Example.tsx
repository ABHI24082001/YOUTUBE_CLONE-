import {Center, HStack, VStack, Skeleton} from 'native-base';
import React from 'react';

const Example = () => {
  return (
    <Center w="100%" py={4}>
      <VStack
        w="90%"
        maxW="400"
        borderWidth="1"
        space={4}
        overflow="hidden"
        rounded="md"
        _dark={{
          borderColor: 'coolGray.500',
        }}
        _light={{
          borderColor: 'coolGray.200',
        }}
        p={4}>
        {/* Skeleton for the thumbnail */}
        <Skeleton h="200" w="100%" rounded="md" />

        {/* Skeleton for the title and description */}
        <VStack space={2}>
          <Skeleton h="6" w="70%" rounded="md" startColor="primary.100" />
          <Skeleton.Text lines={3} px="2" />
        </VStack>

        {/* Skeleton for the profile picture and metadata */}
        <HStack space={3} alignItems="center">
          <Skeleton size="10" rounded="full" />
          <VStack space={1} flex={1}>
            <Skeleton h="4" w="50%" rounded="md" startColor="primary.100" />
            <Skeleton h="3" w="30%" rounded="md" />
          </VStack>
        </HStack>
      </VStack>
      <VStack
        w="90%"
        maxW="400"
        borderWidth="1"
        space={4}
        overflow="hidden"
        rounded="md"
        _dark={{
          borderColor: 'coolGray.500',
        }}
        _light={{
          borderColor: 'coolGray.200',
        }}
        p={4}>
        {/* Skeleton for the thumbnail */}
        <Skeleton h="200" w="100%" rounded="md" />

        {/* Skeleton for the title and description */}
        <VStack space={2}>
          <Skeleton h="6" w="70%" rounded="md" startColor="primary.100" />
          <Skeleton.Text lines={3} px="2" />
        </VStack>

        {/* Skeleton for the profile picture and metadata */}
        <HStack space={3} alignItems="center">
          <Skeleton size="10" rounded="full" />
          <VStack space={1} flex={1}>
            <Skeleton h="4" w="50%" rounded="md" startColor="primary.100" />
            <Skeleton h="3" w="30%" rounded="md" />
          </VStack>
        </HStack>
      </VStack>
      
    </Center>
  );
};

export default Example;
