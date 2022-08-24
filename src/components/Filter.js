import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Filter({
  searchedPost,
  setSearchedPost,
  searchButtonPress,
}) {
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
