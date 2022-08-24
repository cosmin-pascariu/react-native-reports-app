import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Comment({userId, comment, commentTimeStamp}) {
  const [user, setUser] = useState(null);

  console.log('userId', userId);

  useEffect(() => {
    const getUserData = async () => {
      firestore()
        .collection('users')
        .where('uid', '==', userId)
        .onSnapshot(doc => {
          doc.forEach(doc => {
            setUser(doc.data());
            console.log('user', user);
          });
        });
    };
    getUserData();
  }, []);

  return (
    <View style={styles.commentContainer}>
      <Image
        source={{uri: user?.profileImage || auth().currentUser.photoURL}}
        style={styles.profileImage}
      />
      <View style={styles.commentView}>
        <Text style={styles.commentText}>
          <Text style={styles.profileName}>
            {user?.name || auth().currentUser.displayName}
          </Text>{' '}
          {comment}
        </Text>
        <Text style={styles.commentTime}>{commentTimeStamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 5,
    width: '95%',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  commentText: {
    fontSize: 16,
    color: '#323232',
    marginLeft: 10,
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
    objectFit: 'cover',
  },
  profileName: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  commentView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: 20,
  },
  commentTime: {
    fontSize: 12,
    color: '#000',
    marginLeft: 10,
    marginRight: 10,
  },
});
