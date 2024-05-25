import {Avatar, Box, HStack, Pressable, StatusBar, VStack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
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
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {AppIcon} from '~/components/core';

const {width} = Dimensions.get('screen');
const videoMinHeight = 60;
const videoMinWidth = 100;

// Fetch YouTube data
const fetchYouTubeData = async () => {
  const response = await fetch(
    'https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelType=any&eventType=completed&maxResults=30&q=fun&type=video&videoType=any&key=AIzaSyDjJeurHnpol1e9q19_8aFCsDF8iWBXUQQ',
  );
  const data = await response.json();
  return data.items;
};

const ListItem = ({onSelect, data}) => (
  <FlatList
    keyExtractor={item => item.id.videoId}
    data={data}
    renderItem={({item}) => (
      <TouchableOpacity
        key={item.id.videoId}
        onPress={() => onSelect(item)}
        activeOpacity={0.9}>
        <View style={styles.videoTumbnail}>
          <Image
            style={styles.tumbnail}
            source={{uri: item.snippet.thumbnails.medium.url}}
            resizeMode="contain"
          />
        </View>
        <Box p={2}>
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
      </TouchableOpacity>
    )}
  />
);

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
              <Box p={2}>
                <HStack alignItems={'center'} space={3}>
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
              <AppIcon AntDesignName="closecircle" size={30} color={'#000'} />
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
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ListItem onSelect={onSelect} data={listData} />
      )}
    </Animated.View>
  );
}

export default function Home() {
  const [selectedItem, setSelectedVideo] = useState(null);
  const [fetching, setFetching] = useState(true);
  const containerHeight = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    fetchYouTubeData().then(data => {
      setListData(data);
      setFetching(false);
    });
  }, []);

  const onSelect = useCallback(data => {
    setSelectedVideo(data);
    containerHeight.value = withSpring(videoMinHeight, springConfig(20));
    translateY.value = withSpring(0, springConfig(-20));
  }, []);

  const onLayout = useCallback(
    event => {
      const {height} = event.nativeEvent.layout;
      containerHeight.value = height - videoMinHeight;
    },
    [containerHeight],
  );

  return (
    <View style={styles.fill}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Box my={2}>
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={{
              uri: 'https://www.versionmuseum.com/images/websites/youtube-website/youtube-website%5E2017%5Eyoutube-logo-redesign-cropped.jpg',
            }}
          />
          <Box>
            <HStack space={2} mr={3}>
              <AppIcon FeatherName="cast" size={20} color={'#000'} />
              <AppIcon
                IoniconsName="notifications-outline"
                size={20}
                color={'#000'}
              />
              <AppIcon AntDesignName="search1" size={20} color={'#000'} />
            </HStack>
          </Box>
        </HStack>
      </Box>
      {selectedItem && (
        <VideoPlayerContainer
          onLayout={onLayout}
          translateY={translateY}
          movableHeight={containerHeight.value}
          selectedItem={selectedItem}
          onSelect={onSelect}
          fetching={fetching}
          listData={listData}
        />
      )}
      {!selectedItem && <ListItem onSelect={onSelect} data={listData} />}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  fillWidth: {width: '100%'},
  subContainer: {
    position: 'absolute',
    zIndex: 100,
    width: '90%',
    height: '90%',
  },
  videoTumbnail: {
    width: '100%',
    height: 200,
    
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 8,
    zIndex: 99,
    padding: 5,
  },
  tumbnail: {width: '100%', height: '100%'},
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  subTitle: {
    fontSize: 5,
    color: '#555',
  },
  selectedItemDetails: {
    padding: 10,
  },
  sub: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  logo: {
    height: 50,
    width: 100,
  },
});
