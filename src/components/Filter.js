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
  setRadioButtonValue,
  setFilterRadioButtonValue,
  setSortOrder,
  filterButtonPress,
}) {
  const radioButtonsData = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Title',
      value: 'title',
    },
    {
      id: '2',
      label: 'Location',
      value: 'location',
    },
    {
      id: '3',
      label: 'Created Date',
      value: 'createdAt',
    },
  ];

  const filterRadioButtonsData = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Title',
      value: 'title',
    },
    {
      id: '2',
      label: 'Location',
      value: 'location',
    },
    {
      id: '3',
      label: 'Description',
      value: 'description',
    },
  ];

  const sortOrder = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Ascending',
      value: 'ascending',
    },
    {
      id: '2',
      label: 'Descending',
      value: 'descending',
    },
  ];

  const [radioButtons, setRadioButtons] = useState(radioButtonsData);
  const [filterRadioButtons, setFilterRadioButtons] = useState(
    filterRadioButtonsData,
  );
  const [sortOrderRadioButtons, setSortOrderRadioButtons] = useState(sortOrder);

  function onPressRadioButton(radioButtonsArray) {
    setRadioButtons(radioButtonsArray);
    radioButtonsArray.forEach(element => {
      element.selected ? setRadioButtonValue(element.value) : null;
    });
  }

  function onPressFilterRadioButton(radioButtonsArray) {
    setFilterRadioButtons(radioButtonsArray);
    radioButtonsArray.forEach(element => {
      element.selected ? setFilterRadioButtonValue(element.value) : null;
    });
  }

  function onPressSortOrderRadioButton(radioButtonsArray) {
    setSortOrderRadioButtons(radioButtonsArray);
    radioButtonsArray.forEach(element => {
      element.selected ? setSortOrder(element.value) : null;
    });
  }

  return (
    <View style={styles.filter}>
      <View style={styles.rowContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Search"
          color="#323232"
          placeholderTextColor="#999"
          value={searchedPost}
          onChangeText={text => setSearchedPost(text)}
        />
        <TouchableOpacity
          onPress={() => searchButtonPress()}
          style={styles.searchButton}>
          <Ionicons name="ios-search" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.radioContainer}>
          <Text style={styles.sortTitle}> Sort by: </Text>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={onPressRadioButton}
            containerStyle={styles.radioGroup}
          />

          <Text style={styles.sortTitle}> Order: </Text>
          <RadioGroup
            radioButtons={sortOrderRadioButtons}
            onPress={onPressSortOrderRadioButton}
            containerStyle={styles.radioGroup}
          />
        </View>
        <View style={styles.radioContainer}>
          <Text style={styles.sortTitle}> Filter by: </Text>
          <RadioGroup
            radioButtons={filterRadioButtons}
            radioButtonStyle={{borderWidth: 1, color: '#323232'}}
            onPress={onPressFilterRadioButton}
            containerStyle={styles.radioGroup}
          />
          <View style={styles.centerContent}>
            <TouchableOpacity
              onPress={() => filterButtonPress()}
              style={styles.sortButton}>
              <Text style={styles.sortButtonText}>Sort</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    color: '#323232',
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
    color: '#323232',
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
    color: '#323232',
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
  sortButton: {
    width: 80,
    height: 40,
    borderRadius: 8,
    marginTop: 20,
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
  radioContainer: {
    width: '50%',
    alignItems: 'flex-start',
  },
  radioGroup: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 10,
    color: '#323232',
    radioButtonStyle: {
      borderWidth: 1,
      color: '#323232',
    },
  },
  sortTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#323232',
  },
  centerContent: {
    width: '100%',
    height: 100,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sortButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
