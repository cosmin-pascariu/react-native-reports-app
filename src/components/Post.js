import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Post({
  userProfileImage,
  userProfileName,
  title,
  location,
}) {
  return (
    <ScrollView style={styles.postContainer}>
      <View style={styles.profileContainer}>
        <Image source={userProfileImage} style={styles.profileImage} />
        <View>
          <Text style={styles.profileName}>{userProfileName}</Text>
          <Text style={styles.postLocation}>{location}</Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images.jpeg')}
          style={styles.postImage}
        />
        {/* <Ionicons name="heart-circle-sharp" style={styles.heartIconFalse} />
        <Ionicons name="heart-sharp" style={styles.heartIconTrue} /> */}
      </View>
      <Text style={styles.postTitle}>{title}</Text>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <Text>Description</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    borderWidth: 1,
    borderColor: '#000',
    width: '100%',
    marginTop: 10,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  postTitle: {
    fontSize: 16,
    color: '#303030',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 5,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#000',
    alignItems: 'center',
  },
  heartIconFalse: {
    color: 'gray',
    fontSize: 40,
    marginTop: 10,
    position: 'absolute',
    right: 10,
  },
  heartIconTrue: {
    color: 'red',
    fontSize: 25,
    marginTop: 10,
    position: 'absolute',
    right: 18,
    top: 10,
  },
  postImage: {
    objectFit: 'cover',
    // width: '100%',
    height: 400,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  profileName: {
    fontSize: 14,
    textDecoration: 'none',
    color: '#303030',
    fontWeight: 'bold',
  },
  profileNameContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  postLocation: {
    fontSize: 10,
    color: '#899999',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
});
