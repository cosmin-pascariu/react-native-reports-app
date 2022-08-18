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
import React, {useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function Post({
  userProfileImage,
  userProfileName,
  postImages,
  title,
  location,
  description,
  bookmarkStatus,
  createdAt,
}) {
  const [savedPost, setSavedPost] = useState(bookmarkStatus);
  const [isImportant, setIsImportant] = useState(false);
  const [isGood, setIsGood] = useState(false);
  const [isNotGood, setIsNotGood] = useState(false);

  const [comment, setComment] = useState('');
  const [seeMore, setSeemore] = useState(false);

  const [imgActive, setImgActive] = useState(0);
  const [images, setImages] = useState([]);
  const [postId, setPostId] = useState();

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

  const getPostId = async () => {
    const postID = await firestore()
      .collection('posts')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // if (doc.data().createdAt === createdAt) {
          //   setPostId(doc.id);
          // }
          // console.log('id', doc.id);
          // console.log('1:', doc.data().createdAt);
          // console.log('2:', createdAt);
          setPostId(doc.id);
        });
      });
  };

  const onBookmarkPress = () => {
    getPostId();
    console.log('postId', postId);
    if (savedPost) {
      firestore()
        .collection('posts')
        .doc(postId)
        .update({
          bookmark: false,
        })
        .then(() => {
          setSavedPost(false);
        })
        .catch(error => {
          console.log(error);
        })
        .then(() => {
          Alert.alert('Bookmark Removed');
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      firestore()
        .collection('posts')
        .doc(postId)
        .update({
          bookmark: true,
        })
        .then(() => {
          setSavedPost(true);
        })
        .catch(error => {
          console.log(error);
        })
        .then(() => {
          Alert.alert('Bookmark Added');
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const onImportantPress = () => {
    setIsImportant(!isImportant);
    console.log(isImportant);
  };
  const onGoodPress = () => {
    setIsGood(!isGood);
    console.log(isGood);
  };
  const onNotGoodPress = () => {
    setIsNotGood(!isNotGood);
    console.log(isNotGood);
  };
  useEffect(() => {
    const getImageFromStorage = async () => {
      const imagesFromStorage = [];
      for (let i = 0; i < postImages.length; i++) {
        const image = await storage().ref(postImages[i]).getDownloadURL();
        imagesFromStorage.push(image);
      }
      setImages(imagesFromStorage);
    };
    getImageFromStorage();
  }, []);

  const getPostedTime = () => {
    const date = new Date();
    const postedDate = createdAt.toDate();
    const postedTime = date.getTime() - postedDate.getTime();
    const postedTimeInMinutes = postedTime / 60000;
    if (postedTimeInMinutes < 1) {
      return 'Just now';
    }
    if (postedTimeInMinutes < 60) {
      return Math.floor(postedTimeInMinutes) + ' minutes ago';
    }
    if (postedTimeInMinutes < 1440) {
      return Math.floor(postedTimeInMinutes / 60) + ' hours ago';
    }
    if (postedTimeInMinutes < 10080) {
      return Math.floor(postedTimeInMinutes / 1440) + ' days ago';
    }
    if (postedTimeInMinutes < 43200) {
      return Math.floor(postedTimeInMinutes / 10080) + ' weeks ago';
    }
    if (postedTimeInMinutes < 518400) {
      return Math.floor(postedTimeInMinutes / 43200) + ' months ago';
    }
    return Math.floor(postedTimeInMinutes / 518400) + ' years ago';
  };

  const route = useRoute();

  return (
    <View style={styles.postContainer}>
      <View style={styles.profileContainer}>
        <Image source={{uri: userProfileImage}} style={styles.profileImage} />
        <View>
          <Text style={styles.profileName}>{userProfileName}</Text>
          <Text style={styles.postLocation}>{location}</Text>
        </View>
        {route.name === 'MyPosts' && (
          <Ionicons
            name="ellipsis-vertical-sharp"
            style={styles.settingButtonIcon}
            onPress={() => Alert.alert('This will open settings!')}
          />
        )}
      </View>
      <ScrollView
        onScroll={({nativeEvent}) => onchange(nativeEvent)}
        showHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        style={styles.imageContainer}>
        {images.map(image => (
          <Image
            key={uuid.v4()}
            source={{uri: image}}
            style={[styles.postImage, {width: WIDTH}]}
          />
        ))}
      </ScrollView>
      <View style={styles.imageDot}>
        {postImages.map((e, index) => (
          <Text
            key={e}
            style={imgActive == index ? styles.dotActive : styles.dot}>
            &#9679;
          </Text>
        ))}
      </View>
      <View style={styles.upvotedContent}>
        <View style={styles.upvotedButtons}>
          <Ionicons
            name={isImportant ? 'alert-circle' : 'alert-circle-outline'}
            style={{color: isImportant ? 'orange' : '#888', fontSize: 25}}
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
            style={{color: isGood ? 'green' : '#888', fontSize: 25}}
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
            style={{color: isNotGood ? 'red' : '#888', fontSize: 25}}
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
          style={{color: savedPost ? 'black' : '#888', fontSize: 25}}
          onPress={() => onBookmarkPress()}
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
      <Text style={styles.seePostTime}>{getPostedTime()}</Text>
      <View
        style={{
          borderBottomColor: '#999',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <View style={styles.commentContainer}>
        <Image
          source={{uri: auth().currentUser.photoURL}}
          style={styles.profileImage}
        />
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
    backgroundColor: '#353535',
  },
  postImage: {
    objectFit: 'cover',
    height: 400,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
    objectFit: 'cover',
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
  settingButtonIcon: {
    fontSize: 24,
    color: '#323232',
    marginLeft: 'auto',
    marginRight: 20,
  },
});
