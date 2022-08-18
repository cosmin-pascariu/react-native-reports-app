import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Post from '../components/Post';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';

export default function MyPostsScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    firestore()
      .collection('posts')
      .where('userId', '==', auth().currentUser.uid)
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
            key={uuid.v4()}
            userId={post.userId}
            userProfileImage={
              'https://ps.w.org/cbxuseronline/assets/icon-256x256.png?rev=2284897'
            }
            userProfileName={post.postUserName}
            location="Bucharest, Romania"
            postImages={post.images}
            title={post.title}
            description={post.description}
            bookmarkStatus={post.bookmark}
            createdAt={post.createdAt}
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
