import {StyleSheet, Text, View, ScrollView, Keyboard} from 'react-native';
import React, {useState, useEffect} from 'react';
import Post from '../components/Post';
import NoPostsScreen from './NoPostsScreen';
import firestore from '@react-native-firebase/firestore';
import auth, {getAuth, updateProfile} from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';

Keyboard.dismiss();

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    firestore()
      .collection('posts')
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push({...doc.data(), id: doc.id});
        });
        setPosts(docs);
      });
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {posts.map(post => (
          <Post
            key={uuid.v4()}
            postId={post.id}
            userId={post.userId}
            userProfileImage={
              'https://ps.w.org/cbxuseronline/assets/icon-256x256.png?rev=2284897'
            }
            userProfileName={post.postUserName}
            location={post.location}
            postImages={post.images}
            title={post.title}
            description={post.description}
            bookmarkStatus={post.bookmark}
            createdAt={post.createdAt}
            usersList={post.usersList}
            important={post.important}
            good={post.good}
            bad={post.bad}
          />
        ))}
        {posts.length === 0 && <NoPostsScreen />}
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
