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
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export default function FavouritesScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    firestore()
      .collection('posts')
      .where('bookmark', '==', true)
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push(doc.data());
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
        {posts.length === 0 && (
          <View style={styles.noPosts}>
            <Image
              source={require('../assets/noData.png')}
              style={styles.noDataImage}
            />
            <Text style={styles.noDataText}>No favourites yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPosts: {
    height: Dimensions.get('window').height - 200,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataImage: {
    width: Dimensions.get('window').width * 0.75,
    height: Dimensions.get('window').width * 0.75,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#323232',
    marginTop: 10,
  },
});
