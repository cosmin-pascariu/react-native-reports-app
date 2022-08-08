import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import Post from '../components/Post';

export default function FavouritesScreen() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Post
          userProfileImage={require('../assets/images.jpeg')}
          userProfileName="Costel Anton"
          location="Bucharest, Romania"
          postImage={require('../assets/treePost.jpeg')}
          title="Post Title"
          description="Lorem ipsum dolor sit amet, fhsajhdfg jhgsjhga jhgfjkgsjg afgskjgakjhg kjh shdfa kjsdjfkahls kkjfsha lkjconsectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
        <Post
          userProfileImage={require('../assets/images.jpeg')}
          userProfileName="Costel Anton"
          location="Bucharest, Romania"
          postImage={require('../assets/treePost.jpeg')}
          title="Post Title"
          description="Lorem ipsum dolor sit amet, fhsajhdfg jhgsjhga jhgfjkgsjg afgskjgakjhg kjh shdfa kjsdjfkahls kkjfsha lkjconsectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
        <Post
          userProfileImage={require('../assets/images.jpeg')}
          userProfileName="Costel Anton"
          location="Bucharest, Romania"
          postImage={require('../assets/treePost.jpeg')}
          title="Post Title"
          description="Lorem ipsum dolor sit amet, fhsajhdfg jhgsjhga jhgfjkgsjg afgskjgakjhg kjh shdfa kjsdjfkahls kkjfsha lkjconsectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
