import { Avatar, Box, HStack, VStack } from 'native-base';
import React from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';

const VideoItem = ({item, onSelect}) => {
  return (
    <Pressable onPress={() => onSelect(item)}>
      <View>
        <Image
          source={{uri: item.snippet.thumbnails.medium.url}}
          style={styles.thumbnail}
        />
        <Box p={1} width={'80%'}>
          <HStack alignItems={'center'} space={3}>
            <Avatar
              ml={2}
              bg="green.500"
              size={'sm'}
              source={{uri: item.snippet.thumbnails.default.url}}
            />
            <VStack>
              <Text style={styles.title}>{item.snippet.title}</Text>
              <Text style={styles.subTitle}>{item.snippet.description}</Text>
            </VStack>
          </HStack>
        </Box>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  
  thumbnail: {
    width: '100%',
    height: 200,
  },
  subTitle: {
    fontSize: 10,
    color: '#555',
  },
  infoContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  channelTitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default VideoItem;
