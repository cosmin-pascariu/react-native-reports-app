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
  console.disableYellowBox = true;
  const [posts, setPosts] = useState([]); // array of posts
  const [allPosts, setAllPosts] = useState([]); // array of all posts
  const [userData, setUserData] = useState(null); // user data
  const [searchedItem, setSearchedItem] = useState(''); // value from search input
  const [radioButtonValue, setRadioButtonValue] = useState(''); // value for sorting
  const [filterRadioButtonValue, setFilterRadioButtonValue] = useState(''); // value for filtering
  const [sortOrder, setSortOrder] = useState(''); // value for sorting order

  // const getPostData = async () => {
  //   await firestore()
  //     .collection('posts')
  //     .where('status', '==', 'approved')
  //     .onSnapshot(snapshot => {
  //       let docs = [];
  //       snapshot.forEach(doc => {
  //         docs.push({...doc.data(), id: doc.id});
  //       });
  //       setPosts(docs);
  //       setAllPosts(docs);
  //     });
  // };

  // const getUserData = async () => {
  //   await firestore()
  //     .collection('users')
  //     .where('uid', '==', auth().currentUser.uid)
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot.forEach(doc => {
  //         setUserData(doc.data());
  //       });
  //     });
  // };

  const getPosts = async () => {
    await firestore()
      .collection('users')
      .where('uid', '==', auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(user => {
          setUserData(user.data());
          firestore()
            .collection('posts')
            .where('status', '==', 'approved')
            .onSnapshot(snapshot => {
              let docs = [];
              snapshot.forEach(post => {
                if (user.data().admin === false) {
                  if (post.data().location.includes(user.data().location)) {
                    docs.push({...post.data(), id: post.id});
                  }
                } else {
                  docs.push({...post.data(), id: post.id});
                }
              });
              setPosts(docs);
              setAllPosts(docs);
            });
        });
      });
  };

  useEffect(() => {
    // getPostData();
    // getUserData();
    getPosts();
  }, []);

  const sortSwitch = value => {
    let sorted = [];
    if (sortOrder === 'ascending') {
      sorted = posts.sort((a, b) => {
        return a[value] < b[value] ? 1 : -1;
      });
    } else if (sortOrder === 'descending') {
      sorted = posts.sort((a, b) => {
        return a[value] > b[value] ? 1 : -1;
      });
    }
    return setPosts(sorted);
  };
  // this function is working
  const filterSwitch = value => {
    if (searchedItem === '' || !value) {
      return setPosts(allPosts);
    }
    const filtered = posts.filter(post => {
      return post[value].toLowerCase().includes(searchedItem.toLowerCase());
    });
    return filtered.length > 0 ? setPosts(filtered) : setPosts(allPosts);
  };

  return (
    <ScrollView>
      {filterState && (
        <Filter
          searchedPost={searchedItem} // value from search input
          setSearchedPost={setSearchedItem} // set value from search input
          searchButtonPress={() => {
            filterSwitch(filterRadioButtonValue); // when click on search button
          }}
          setRadioButtonValue={setRadioButtonValue} // value of sorting radio button
          setFilterRadioButtonValue={setFilterRadioButtonValue} // value of filtering radio button
          filterButtonPress={() => {
            // setPosts(sortDescByTime());
            sortSwitch(radioButtonValue);
            setPosts(posts);
          }} // when click on filter button
          setSortOrder={setSortOrder} // value of sorting order radio button
        />
      )}
      <View style={styles.container}>
        {posts.length > 0
          ? posts.map(post => (
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
                admin={false}
              />
            ))
          : allPosts.map(post => (
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
        {allPosts.length === 0 && <NoPostsScreen />}
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
