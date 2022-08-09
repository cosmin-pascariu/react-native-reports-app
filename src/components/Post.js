import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  Button,
  Alert,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const images = [
  'https://images.freeimages.com/images/previews/e04/yellow-frontal-with-ivy-1228121.jpg',
  'https://images.freeimages.com/images/previews/5e0/daisys-1392171.jpg',
  'https://images.freeimages.com/variants/iaDKoTTnJNGeJe44QrjwQ9Mi/f4a36f6589a0e50e702740b15352bc00e4bfaf6f58bd4db850e167794d05993d',
];

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function Post({
  userProfileImage,
  userProfileName,
  // postImage,
  title,
  location,
  description,
}) {
  const [savedPost, setSavedPost] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [isGood, setIsGood] = useState(false);
  const [isNotGood, setIsNotGood] = useState(false);

  const [comment, setComment] = useState('');
  const [seeMore, setSeemore] = useState(false);

  const [imgActive, setImgActive] = useState(0);

  const onchange = nativeEvent => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slide !== imgActive) {
        setImgActive(slide);
      }
    }
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.profileContainer}>
        <Image source={userProfileImage} style={styles.profileImage} />
        <View>
          <Text style={styles.profileName}>{userProfileName}</Text>
          <Text style={styles.postLocation}>{location}</Text>
        </View>
      </View>
      {/* <View style={styles.imageContainer}> */}
      <ScrollView
        onScroll={({nativeEvent}) => onchange(nativeEvent)}
        showHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        style={styles.imageContainer}>
        {/* <Image source={postImage} style={styles.postImage} /> */}
        {images.map(
          (
            image,
            index, //postImages
          ) => (
            <Image
              key={index}
              source={{uri: image}}
              style={[styles.postImage, {width: WIDTH}]}
            />
          ),
        )}
      </ScrollView>
      <View style={styles.imageDot}>
        {images.map(
          (
            e,
            index, //postImages
          ) => (
            <Text
              key={e}
              style={imgActive == index ? styles.dotActive : styles.dot}>
              &#9679;
            </Text>
          ),
        )}
      </View>
      {/* </View> */}
      <View style={styles.upvotedContent}>
        <View style={styles.upvotedButtons}>
          <Ionicons
            name={isImportant ? 'alert-circle' : 'alert-circle-outline'}
            style={{color: isImportant ? 'orange' : '#323232', fontSize: 25}}
            onPress={() => {
              setIsImportant(!isImportant);
              if (isImportant === false) {
                setIsNotGood(false);
                setIsGood(false);
              }
            }}
          />
          <Ionicons
            name={isGood ? 'checkmark-circle' : 'checkmark-circle-outline'}
            style={{color: isGood ? 'green' : '#323232', fontSize: 25}}
            onPress={() => {
              setIsGood(!isGood);
              if (isGood === false) {
                setIsImportant(false);
                setIsNotGood(false);
              }
            }}
          />
          <Ionicons
            name={isNotGood ? 'close-circle' : 'close-circle-outline'}
            style={{color: isNotGood ? 'red' : '#323232', fontSize: 25}}
            onPress={() => {
              setIsNotGood(!isNotGood);
              if (isNotGood === false) {
                setIsImportant(false);
                setIsGood(false);
              }
            }}
          />
        </View>
        <Ionicons
          name={savedPost ? 'bookmark' : 'bookmark-outline'}
          style={{color: 'black', fontSize: 25}}
          onPress={() => setSavedPost(!savedPost)}
        />
      </View>
      <View
        style={{
          borderBottomColor: '#999',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <Text style={styles.postTitle}>{title}</Text>
      <Text style={styles.postDescription} numberOfLines={seeMore ? 0 : 3}>
        {description}
      </Text>
      <Text style={styles.seeMore} onPress={() => setSeemore(!seeMore)}>
        {seeMore ? 'see less' : 'see more'}
      </Text>
      <Text style={styles.seePostTime}>2 hours ago</Text>
      <View
        style={{
          borderBottomColor: '#999',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <View style={styles.commentContainer}>
        <Image source={userProfileImage} style={styles.profileImage} />
        <TextInput
          style={styles.postComment}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={text => setComment(text)}
          multiline={true}
        />
        <Text
          style={styles.postCommentButton}
          onPress={() => Alert.alert(comment)}>
          Post
        </Text>
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
    color: '#323232',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 10,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#000',
  },
  postImage: {
    objectFit: 'cover',
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
    color: '#323232',
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
    marginLeft: 10,
    marginRight: 10,
    // height: 103,
    textOverflow: 'ellipsis',
    textAlign: 'justify',
  },
  upvotedContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 3,
    marginBottom: 3,
  },
  commentContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'flex-start',
    marginTop: 5,
    marginBottom: 5,
  },
  postComment: {
    fontSize: 14,
    marginLeft: 10,
    marginRight: 10,

    paddingTop: 0,
    paddingBottom: 0,
    width: '75%',
  },
  postCommentButton: {
    fontSize: 14,
    color: '#1278d9',
    marginTop: 3,
  },
  seeMore: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 10,
  },
  seePostTime: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 10,
  },
  upvotedButtons: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'space-between',
  },
  imageDot: {
    position: 'absolute',
    top: HEIGHT / 2 + 25,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotActive: {
    margin: 3,
    color: 'black',
    fontSize: 20,
  },
  dot: {
    margin: 3,
    color: '#888',
    fontSize: 20,
  },
});
