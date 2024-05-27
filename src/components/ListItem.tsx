import {Avatar, Box, HStack, VStack, Spinner} from 'native-base';
import React, {useState, useCallback} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

interface ListItemProps {
  onSelect: (item: any) => void;
  data: Array<{
    id: {videoId: string};
    snippet: {
      title: string;
      description: string;
      thumbnails: {medium: {url: string}; default: {url: string}};
    };
  }>;
  loading: boolean;
  loadingMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  onSelect,
  data,
  loading,
  loadingMore,
  onRefresh,
  onLoadMore,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 2000); // simulate network request
  }, [onRefresh]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <Spinner size="lg" color="#000" />;
  };

  
console.log(data)
  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          keyExtractor={item => item.id.videoId}
          data={data}
          renderItem={({item}) => (
            <TouchableOpacity
              key={item.id.videoId}
              onPress={() => onSelect(item)}
              activeOpacity={0.9}>
              <View>
                <Image
                  source={{uri: item.snippet.thumbnails.medium.url}}
                  style={styles.thumbnail}
                />
                <Box p={2} width={'80%'}>
                  <HStack alignItems={'center'} space={3}>
                    <Avatar
                      ml={2}
                      bg="green.500"
                      size={'sm'}
                      source={{uri: item.snippet.thumbnails.default.url}}
                    />
                    <VStack>
                      <Text style={styles.title}>{item.snippet.title}</Text>
                      <Text style={styles.subTitle}>
                        {item.snippet.description}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  subTitle: {
    fontSize: 10,
    color: '#555',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },
});

export default ListItem;
