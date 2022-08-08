import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Post from '../components/Post';

export default function FavouritesScreen() {
  return (
    <View style={styles.container}>
      <Post
        userProfileImage={require('../assets/images.jpeg')}
        userProfileName="Costel Anton"
        title="Post Title"
        location="Bucharest, Romania"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
