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

  const getPostData = () => {
    firestore()
      .collection('posts')
      .where('status', '==', 'approved')
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push({...doc.data(), id: doc.id});
        });
        setPosts(docs);
        setAllPosts(docs);
      });
  };

  const getUserData = () => {
    firestore()
      .collection('users')
      .where('uid', '==', auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setUserData(doc.data());
        });
      });
  };

  useEffect(() => {
    getPostData();
    getUserData();
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

// const sortDescByTitle = () => {
//   let sorted = posts.sort((a, b) => {
//     console.log('a,b:', a.title, b.title);
//     return a.title > b.title ? 1 : -1;
//   });
//   return sorted;
// };

// const sortAscByTitle = () => {
//   let sorted = posts.sort((a, b) => {
//     console.log('a,b:', a.title, b.title);
//     return a.title < b.title ? 1 : -1;
//   });
//   return sorted;
// };

// const sortDescByTime = () => {
//   let sorted = posts.sort((a, b) => {
//     console.log('a,b:', a.createdAd, b.createdAt);
//     return a.createdAt > b.createdAt ? 1 : -1;
//   });
//   return sorted;
// };

// const sortAscByTime = () => {
//   let sorted = posts.sort((a, b) => {
//     console.log('a,b:', a.createdAd, b.createdAt);
//     return a.createdAt < b.createdAt ? 1 : -1;
//   });
//   return sorted;
// };

// const sortSwitch = value => {
//   let sorted = [];
//   switch (value) {
//     case 'title':
//       sorted = posts
//         .sort((a, b) => {
//           console.log('a,b:', a.title, b.title);
//           return a.title > b.title ? 1 : -1;
//         })
//         .reverse();
//       setPosts(sorted);
//       break;
//     case 'location':
//       sorted = posts
//         .sort((a, b) => {
//           console.log('a,b:', a.location, b.location);
//           return a.location > b.location ? 1 : -1;
//         })
//         .reverse();
//       setPosts(sorted);
//       break;
//     case 'createdAt':
//       sorted = posts
//         .sort((a, b) => {
//           console.log('a,b:', a.createdAt, b.createdAt);
//           return a.createdAt < b.createdAt ? 1 : -1;
//         })
//         .reverse();
//       setPosts(sorted);
//       break;
//     case 'comments':
//       sorted = posts
//         .sort((a, b) => {
//           console.log('a,b:', a.comments, b.comments);
//           return a.comments > b.comments ? 1 : -1;
//         })
//         .reverse();
//       setPosts(sorted);
//       break;
//     default:
//       break;
//   }
// };
