import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Box, Button, HStack, ScrollView} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useSharedValue, withSpring} from 'react-native-reanimated';
import {ListItem, Search} from '~/components';
import VideoPlayerContainer from '~/components/VideoPlayerContainer';
import {AppIcon} from '~/components/core';
import { Example } from '~/components/shared';
import {PublicRoutesTypes} from '~/routes';

const {width} = Dimensions.get('screen');
const videoMinHeight = 60;

const springConfig = (velocity: number) => ({
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
  velocity,
});

export default function Home() {
  const route = useRoute();
  const searchTxt = React.useRef<string>('');
  const [selectedItem, setSelectedVideo] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerHeight = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [listData, setListData] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('fun');
  const [nextPageToken, setNextPageToken] = useState('');

  useEffect(() => {
    if (route.params?.searchQuery) {
      searchTxt.current = route.params.searchQuery;
      fetchYouTubeData(route.params.searchQuery);
    } else {
      fetchYouTubeData('fun');
    }

    const timer = setTimeout(() => {
      setLoadingSkeleton(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [route]);

  const fetchYouTubeData = async (query: string, pageToken = '') => {
    try {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=100&q=${query}&type=video&pageToken=${pageToken}&key=AIzaSyAs_PXPiAbIKhcDM8LuJmRpPt56VHMrkwo`,
      );
      const data = await response.json();
      if (pageToken) {
        // Append to the existing list if there's a pageToken
        setListData(prevData => [...prevData, ...data.items]);
      } else {
        // Otherwise, set the new data
        setListData(data.items);
      }
      setNextPageToken(data.nextPageToken || ''); // Ensure nextPageToken is not undefined
      setFetching(false);
    } catch (error) {
      console.error(error);
      setFetching(false);
    }
  };

  const loadMoreData = async () => {
    if (!loadingMore && nextPageToken) {
      setLoadingMore(true);
      try {
        const response = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=100&q=${activeCategory}&type=video&pageToken=${nextPageToken}&key=AIzaSyC1EbhnoDfooWuTHDlwpw-RIKXSNCuJIK4`,
        );
        const data = await response.json();
        setListData(prevData => [...prevData, ...data.items]);
        setNextPageToken(data.nextPageToken || ''); // Ensure nextPageToken is not undefined
        setLoadingMore(false);
      } catch (error) {
        console.error(error);
        setLoadingMore(false);
      }
    }
  };

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

  const toggleSearchModal = () => {
    setSearchVisible(!searchVisible);
  };

  const handleCategoryChange = query => {
    setActiveCategory(query);
    setFetching(true);
    fetchYouTubeData(query);
  };

  const onRefresh = useCallback(() => {
    setFetching(true);
    fetchYouTubeData(activeCategory);
  }, [activeCategory]);

  const {navigate} =
    useNavigation<NativeStackNavigationProp<PublicRoutesTypes>>();

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
              <Pressable onPress={() => navigate('Search')}>
                <AppIcon AntDesignName="search1" size={20} color={'#000'} />
              </Pressable>
            </HStack>
          </Box>
        </HStack>
      </Box>

      <Box>
        <ScrollView horizontal={true} mx={4}>
          <HStack space={2} ml={3} mb={2} >
            {['All', 'song', 'movies', 'Game', 'news', 'cartoon', 'live'].map(
              category => (
                <Button
                  key={category}
                  size="sm"
                  backgroundColor={
                    activeCategory === category ? 'white' : 'black'
                  }
                  borderColor={activeCategory === category ? 'red' : 'yellow'}
                  borderWidth={1}
                  _text={{
                    color: activeCategory === category ? 'black' : 'white',
                  }}
                  onPress={() => handleCategoryChange(category)}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ),
            )}
          </HStack>
        </ScrollView>
      </Box>

      <Search visible={searchVisible} onClose={toggleSearchModal} />
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
      {!selectedItem && (
        <>
          {loadingSkeleton ? (
            <Example />
          ) : (
            <ListItem
              onSelect={onSelect}
              data={listData}
              loading={fetching}
              onRefresh={onRefresh}
              loadingMore={loadingMore}
              onLoadMore={loadMoreData}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    height: 50,
    width: 100,
  },
  sub: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    marginRight: 8,
  },
  subs: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
