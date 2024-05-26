import {useNavigation, useRoute} from '@react-navigation/native';
import {Box, Button, HStack, Icon, Input} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  Text,
} from 'react-native';
import {useSharedValue, withSpring} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import VideoPlayerContainer from '~/components/VideoPlayerContainer';
import VideoItem from '~/components/videoItem';


const {width} = Dimensions.get('screen');
const videoMinHeight = 60;

const springConfig = velocity => ({
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
  velocity,
});

const Offers = () => {
  const route = useRoute();
  const {goBack} = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedVideo] = useState(null);
  const [fetching, setFetching] = useState(true);
  const containerHeight = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [listData, setListData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('fun');

  useEffect(() => {
    if (route.params?.searchQuery) {
      setSearchText(route.params.searchQuery);
      fetchYouTubeData(route.params.searchQuery);
    } else {
      fetchYouTubeData('fun');
    }
  }, [route.params]);

  const fetchYouTubeData = async query => {
    try {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=300&q=${query}&type=video&key=AIzaSyAs_PXPiAbIKhcDM8LuJmRpPt56VHMrkwo`,
      );
      const data = await response.json();
      setListData(data.items);
      setFetching(false);
    } catch (error) {
      console.error(error);
      setFetching(false);
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

  const handleCategoryChange = query => {
    setActiveCategory(query);
    setFetching(true);
    fetchYouTubeData(query);
  };

  const handleSearch = () => {
    if (searchText) {
      fetchYouTubeData(searchText);
    }
  };

  const renderItem = ({item}) => (
    <VideoItem item={item} onSelect={onSelect} /> // Use the VideoItem component
  );

  return (
    <View style={styles.fill}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Box my={4}>
        <HStack space={2}>
          <Box ml={2} rounded={20}>
            <Pressable onPress={goBack}>
              <Icon
                m="2"
                ml="3"
                size="6"
                color="#000"
                as={<MaterialIcons name="arrow-back" />}
              />
            </Pressable>
          </Box>
          <Input
            placeholder="Search Video"
            width="70%"
            focusOutlineColor={'#cccfcd'}
            borderRadius="30"
            backgroundColor={'#fff'}
            variant={'filled'}
            h={10}
            overflow={'hidden'}
            shadow={2}
            fontSize="14"
            value={searchText}
            onChangeText={text => setSearchText(text)}
            InputLeftElement={
              <Icon
                m="2"
                ml="3"
                size="6"
                color="gray.400"
                as={<MaterialIcons name="search" />}
              />
            }
          />

          <Pressable onPress={handleSearch}>
            <Icon
              m="2"
              ml="3"
              size="6"
              color="#000"
              as={<MaterialIcons name="send" />}
            />
          </Pressable>
        </HStack>
      </Box>

      <Box>
        <HStack space={2} ml={5} mb={2}>
          {['All', 'Short', 'video', 'unwatched', 'watched', 'Recently uploaded'].map(category => (
            <Button
              key={category}
              size="sm"
              backgroundColor={activeCategory === category ? 'white' : 'black'}
              borderColor={activeCategory === category ? 'red' : 'yellow'}
              borderWidth={1}
              _text={{color: activeCategory === category ? 'black' : 'white'}}
              onPress={() => handleCategoryChange(category)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
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
      {!selectedItem && (
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={item => item.id.videoId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Offers;
