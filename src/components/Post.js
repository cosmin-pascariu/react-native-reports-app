import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Post({
  userProfileImage,
  userProfileName,
  postImage,
  title,
  location,
  description,
}) {
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  return (
    <View style={styles.postContainer}>
      <View style={styles.profileContainer}>
        <Image source={userProfileImage} style={styles.profileImage} />
        <View>
          <Text style={styles.profileName}>{userProfileName}</Text>
          <Text style={styles.postLocation}>{location}</Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image source={postImage} style={styles.postImage} />
      </View>
      <View style={styles.titleContent}>
        <Text style={styles.postTitle}>{title}</Text>
        <Ionicons
          name={like ? 'heart' : 'heart-outline'}
          style={{color: like ? 'red' : 'black', fontSize: 20}}
          onPress={() => setLike(!like)}
        />
      </View>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <Text style={styles.postDescription}>{description}</Text>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <View>
        <Text style={styles.postComment}>Add a comment...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    marginTop: 10,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  postTitle: {
    fontSize: 16,
    color: '#303030',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 5,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#000',
    alignItems: 'center',
  },
  postImage: {
    objectFit: 'cover',
    // width: '100%',
    height: 400,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  profileName: {
    fontSize: 14,
    textDecoration: 'none',
    color: '#303030',
    fontWeight: 'bold',
  },
  profileNameContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  postLocation: {
    fontSize: 10,
    color: '#aaa',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  postDescription: {
    fontSize: 14,
    color: '#303030',
    textDecoration: 'none',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 10,
    marginRight: 10,
    maxHeight: 72,
    textOverflow: 'ellipsis',
    textAlign: 'justify',
  },
  postComment: {
    fontSize: 14,
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 10,
    marginRight: 10,
  },
  titleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 5,
  },
});
