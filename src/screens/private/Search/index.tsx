import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Box, HStack, Icon, Input, Pressable} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const Search = () => {
  const {goBack, navigate} = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [videoData, setVideoData] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const history = await AsyncStorage.getItem('searchHistory');
        if (history) {
          setSearchHistory(JSON.parse(history));
        }
      } catch (error) {
        console.error('Failed to load search history', error);
      }
    };
    loadSearchHistory();
  }, []);

  const fetchYouTubeData = async query => {
    try {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=300&q=${query}&type=video&key=AIzaSyAs_PXPiAbIKhcDM8LuJmRpPt56VHMrkwo`,
      );
      const data = await response.json();
      setVideoData(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    if (searchText) {
      const updatedHistory = [...searchHistory, searchText];
      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem(
        'searchHistory',
        JSON.stringify(updatedHistory),
      );
      fetchYouTubeData(searchText);
      navigate('Offers', {searchQuery: searchText});
    }
  };

  const handleHistoryPress = query => {
    setSearchText(query);
    fetchYouTubeData(query);
    navigate('Offers', {searchQuery: query});
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Pressable onPress={() => handleHistoryPress(item.snippet.title)}>
        <HStack alignItems={'center'} width={'90%'}>
          <Icon
            m="2"
            ml="3"
            size="6"
            color="gray.400"
            as={<FontAwesome5Icon name="history" size={10} />}
          />
          <Text style={styles.title}>{item.snippet.title}</Text>
        </HStack>
      </Pressable>
    </View>
  );

  return (
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

      <FlatList
        data={videoData}
        renderItem={renderItem}
        keyExtractor={item => item.id.videoId}
      />
    </Box>
  );
};

export default Search;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
