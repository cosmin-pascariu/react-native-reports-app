import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Post from '../components/Post';
import NoPostsScreen from './NoPostsScreen';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';

export default function FavouritesScreen() {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    await firestore()
      .collection('posts')
      .where('usersList', 'array-contains', auth().currentUser.uid)
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push({...doc.data(), id: doc.id});
        });
        setPosts(docs);
      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {posts.map(post => (
          <Post
            postId={post.id}
            key={uuid.v4()}
            userId={post.userId}
            userProfileImage={
              post.postUserProfilePicture || auth().currentUser.photoURL
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
            comments={post.comments}
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
