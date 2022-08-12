import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Post from '../components/Post';
import firestore from '@react-native-firebase/firestore';

export default function MyPostsScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    firestore()
      .collection('posts')
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push(doc.data());
        });
        console.log(docs);
        setPosts(docs);
      });
  }, []);
  return (
    <ScrollView>
      <View style={styles.container}>
        {posts.map(post => (
          <Post
            key={post.id}
            userProfileImage={require('../assets/images.jpeg')}
            userProfileName="Costel Anton"
            location="Bucharest, Romania"
            postImages={post.images}
            title={post.title}
            description={post.description}
          />
        ))}
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