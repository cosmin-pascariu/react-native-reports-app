import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RadioGroup from 'react-native-radio-buttons-group';

export default function Filter({
  searchedPost,
  setSearchedPost,
  searchButtonPress,
}) {
  const radioButtonsData = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Title',
      value: 'option1',
    },
    {
      id: '2',
      label: 'Location',
      value: 'option2',
    },
  ];

  const [radioButtons, setRadioButtons] = useState(radioButtonsData);

  function onPressRadioButton(radioButtonsArray) {
    setRadioButtons(radioButtonsArray);
  }

  return (
    <View style={styles.filter}>
      <View style={styles.rowContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Search"
          value={searchedPost}
          onChangeText={text => setSearchedPost(text)}
        />
        <TouchableOpacity
          onPress={() => searchButtonPress()}
          style={styles.searchButton}>
          <Ionicons name="ios-search" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.radioContainer}>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={onPressRadioButton}
          flexDirection="row"
          color="#323232"
          selectedBackgroundColor="#323232"
          selectedLabelColor="#323232"
          selectedLabelStyle={{fontSize: 20}}
          labelStyle={{fontSize: 20}}
          buttonContainerStyle={{margin: 10}}
          buttonStyle={{borderWidth: 1, borderColor: '#323232'}}
          buttonSize={20}
          buttonOuterSize={20}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterInput: {
    width: '87%',
    height: 40,
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0356e8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
