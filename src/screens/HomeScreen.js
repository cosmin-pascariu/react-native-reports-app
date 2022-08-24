import {StyleSheet, Text, View, ScrollView, Keyboard} from 'react-native';
import React, {useState, useEffect} from 'react';
import Post from '../components/Post';
import NoPostsScreen from './NoPostsScreen';
import firestore from '@react-native-firebase/firestore';
import auth, {getAuth, updateProfile} from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';
import Filter from '../components/Filter';

Keyboard.dismiss();

export default function HomeScreen({filterState}) {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [searchedItem, setSearchedItem] = useState('');

  useEffect(() => {
    firestore()
      .collection('posts')
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push({...doc.data(), id: doc.id});
        });
        setPosts(docs);
        setAllPosts(docs);
      });
  }, []);

  const filterByPostTitle = () => {
    if (searchedPost === '') {
      return allPosts;
    }
    setPosts(allPosts);
    return posts.filter(post => {
      return post.title.toLowerCase().includes(searchedItem.toLowerCase());
    });
  };
  const filterByPostLocation = () => {
    if (searchedPost === '') {
      return allPosts;
    }
    setPosts(allPosts);
    return posts.filter(post => {
      return post.location.toLowerCase().includes(searchedItem.toLowerCase());
    });
  };

  return (
    <ScrollView>
      {filterState && (
        <>
          <Filter
            searchedPost={searchedItem}
            setSearchedPost={setSearchedItem}
            searchButtonPress={() => {
              setPosts(filterByPostLocation());
            }}
          />
        </>
      )}
      <View style={styles.container}>
        {posts.map(post => (
          <Post
            key={uuid.v4()}
            postId={post.id}
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
