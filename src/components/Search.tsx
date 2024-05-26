import React, {useState} from 'react';
import {
  Pressable,
  Modal,
  StyleSheet,
  TextInput,
  View,
  Text,
  Button,
  Dimensions,
} from 'react-native';

const {height} = Dimensions.get('window');

export default function Search({visible, onClose}) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    // Handle search logic here
    alert(`Searching for: ${searchText}`);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Enter your search..."
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <Button title="Search" onPress={handleSearch} />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalView: {
    height: height * 0.8, // 80% of the screen height
    width: '100%', // full width
    backgroundColor: 'white',
    borderRadius: 0, // no border radius
    padding: 35,
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 10,
    paddingLeft: 10,
    width: '100%',
  },
});
