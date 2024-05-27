import {Avatar, Box, HStack, Pressable, VStack} from 'native-base';
import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import YoutubePlayer from 'react-native-youtube-iframe';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {AppIcon} from '~/components/core';
import ListItem from './ListItem';

const {width} = Dimensions.get('screen');
const videoMinHeight = 60;
const videoMinWidth = 100;

const springConfig = (velocity: number) => {
  'worklet';
  return {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    velocity,
  };
};

function VideoPlayerContainer({
  translateY,
  movableHeight,
  selectedItem,
  onSelect,
  fetching,
  listData,
}) {
  const videoMaxHeight = width * 0.6;
  const videoMaxWidth = width;
  const initialTranslateY = useSharedValue(100);
  const finalTranslateY = useSharedValue(0);
  const initialOpacity = useSharedValue(0);

  const animatedContainerStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translateY.value,
            [0, movableHeight],
            [0, movableHeight],
          ),
        },
        {translateY: initialTranslateY.value},
        {translateY: finalTranslateY.value},
      ],
      opacity: initialOpacity.value,
    };
  });
  const animatedVideoStyles = useAnimatedStyle(() => {
    return {
      width: interpolate(
        translateY.value,
        [movableHeight - videoMinHeight, movableHeight],
        [videoMaxWidth, videoMinWidth],
        {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        },
      ),
      height: interpolate(
        translateY.value,
        [0, movableHeight - videoMinHeight, movableHeight],
        [videoMaxHeight, videoMinHeight + videoMinHeight, videoMinHeight],
        {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        },
      ),
    };
  });
  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      let newValue = event.translationY + ctx.startY;
      if (newValue > movableHeight) newValue = movableHeight;
      if (newValue < 0) newValue = 0;
      translateY.value = newValue;
    },
    onEnd: (evt, ctx) => {
      if (evt.velocityY < -20 && translateY.value > 0)
        translateY.value = withSpring(0, springConfig(evt.velocityY));
      else if (evt.velocityY > 20 && translateY.value < movableHeight)
        translateY.value = withSpring(
          movableHeight,
          springConfig(evt.velocityY),
        );
      else if (translateY.value < movableHeight / 2)
        translateY.value = withSpring(0, springConfig(evt.velocityY));
      else
        translateY.value = withSpring(
          movableHeight,
          springConfig(evt.velocityY),
        );
    },
  });

  useEffect(() => {
    initialTranslateY.value = withSpring(0, springConfig(20));
    initialOpacity.value = withSpring(1, springConfig(20));
  }, []);
  useEffect(() => {
    const backAction = () => {
      if (translateY.value < movableHeight / 2) {
        translateY.value = withSpring(movableHeight, springConfig(40));
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [movableHeight]);

  const openVideo = () => {
    translateY.value = withSpring(0, springConfig(-20));
  };
  const onClose = () => {
    finalTranslateY.value = withSpring(videoMinHeight, springConfig(-20));
    setTimeout(() => onSelect(null), 150);
  };

  return (
    <Animated.View style={[styles.subContainer, animatedContainerStyles]}>
      <PanGestureHandler onGestureEvent={eventHandler}>
        <Animated.View style={styles.fillWidth}>
          <TouchableOpacity
            style={styles.flexRow}
            activeOpacity={0.9}
            onPress={openVideo}>
            <Animated.View style={[animatedVideoStyles]}>
              <YoutubePlayer
                height={300}
                play={true}
                videoId={selectedItem.id.videoId}
                onChangeState={state => {
                  if (state === 'ended') {
                    Alert.alert('Video has finished playing!');
                  }
                }}
              />
            </Animated.View>
            <View>
              <Box p={2} width={'70%'} mx={3}>
                <HStack alignItems={'center'} space={2}>
                  <VStack>
                    <Text style={styles.title}>
                      {selectedItem.snippet.title}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </View>
          </TouchableOpacity>
          <View style={styles.close}>
            <Pressable onPress={onClose} rounded={'full'}>
              <AppIcon AntDesignName="closesquare" size={30} color={'#000'} />
            </Pressable>
          </View>
        </Animated.View>
      </PanGestureHandler>

      
      <View style={styles.selectedItemDetails}>
        <Box
          p={3}
          bgColor={'#fff'}
          borderWidth={1}
          borderColor={'#fff'}
          shadow={4}>
          <HStack alignItems={'center'} justifyContent={'space-between'}>
            <Box>
              <HStack alignItems={'center'} space={4}>
                <Avatar
                  ml={2}
                  bg="green.500"
                  size={'sm'}
                  source={{uri: selectedItem.snippet.thumbnails.default.url}}
                />
                <Text style={styles.title}>
                  {selectedItem.snippet.channelTitle}
                </Text>
              </HStack>
            </Box>

            <Pressable
              p={2}
              py={2}
              borderColor={'white'}
              bgColor={'#000'}
              rounded={'full'}>
              <Text style={styles.sub}>Subscribe</Text>
            </Pressable>
          </HStack>
        </Box>
      </View>
      {fetching ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={'#000'} />
        </View>
      ) : (
        <ListItem onSelect={onSelect} data={listData} loading={false} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  subContainer: {
    position: 'absolute',
    zIndex: 100,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  fillWidth: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#dbdbdb',
   
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 8,
    zIndex: 99,
    padding: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedItemDetails: {
    padding: 10,
  },
  sub: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VideoPlayerContainer;
