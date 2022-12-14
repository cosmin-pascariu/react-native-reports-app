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
  Pressable,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DoubleClick from 'react-native-double-tap';
import Pinchable from 'react-native-pinchable';
import ImageZoom from 'react-native-image-pan-zoom';
import Video from 'react-native-video';
import InViewPort from '@coffeebeanslabs/react-native-inviewport';
import Pdf from 'react-native-pdf';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function Post({
  postId,
  userId,
  userProfileImage,
  userProfileName,
  postImages,
  title,
  location,
  description,
  createdAt,
  modalVisible,
  usersList,
  important,
  myPostId,
  good,
  bad,
  comments,
  postStatus,
  postAdminId,
}) {
  const route = useRoute();
  const navigation = useNavigation();

  const [modalImages, setModalImages] = useState(false);
  comments === undefined ? (comments = []) : (comments = comments);
  const [postComments, setPostComments] = useState(comments);
  const [comment, setComment] = useState('');
  const [seeMore, setSeemore] = useState(false);
  const [imgActive, setImgActive] = useState(0);
  const [images, setImages] = useState([]);
  const [videoPlay, setVideoPlay] = useState(false);
  const updatePostComments = async () => {
    const postRef = firestore().collection('posts').doc(postId);
    await postRef.update({
      comments: postComments,
    });
  };
  // add comment
  const onPostPress = () => {
    if (comment === '') {
      Alert.alert('Please enter a comment');
    } else {
      setPostComments([
        ...postComments,
        {
          userId: auth().currentUser.uid,
          comment: comment,
          commentTimeStamp: new Date().toLocaleString(),
        },
      ]);
      setComment('');
    }
  };
  // initialise the state variables for the post
  usersList === undefined ? (usersList = []) : (usersList = usersList);
  const bookmarkState = usersList.includes(auth().currentUser.uid)
    ? true
    : false;
  const [savedPost, setSavedPost] = useState(bookmarkState);
  important === undefined || important === 0
    ? (important = [])
    : (important = important);
  const importantState = important.includes(auth().currentUser.uid)
    ? true
    : false;
  const [isImportant, setIsImportant] = useState(importantState);
  good === undefined || good === 0 ? (good = []) : (good = good);
  const goodState = good.includes(auth().currentUser.uid) ? true : false;
  const [isGood, setIsGood] = useState(goodState);
  bad === undefined || bad === 0 ? (bad = []) : (bad = bad);
  const badState = bad.includes(auth().currentUser.uid) ? true : false;
  const [isBad, setIsBad] = useState(badState);
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
  const onPressImportant = async () => {
    good.splice(good.indexOf(auth().currentUser.uid), 1);
    bad.splice(bad.indexOf(auth().currentUser.uid), 1);
    if (important.includes(auth().currentUser.uid)) {
      important.splice(important.indexOf(auth().currentUser.uid), 1);
      await firestore()
        .collection('posts')
        .doc(postId)
        .update({
          important: important,
        })
        .then(() => {
          setIsImportant(!isImportant);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      await firestore()
        .collection('posts')
        .doc(postId)
        .update({
          important: [...important, auth().currentUser.uid],
          good: good,
          bad: bad,
        })
        .then(() => {
          setIsImportant(!isImportant);
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    }
  };
  const onPressGood = () => {
    important.splice(important.indexOf(auth().currentUser.uid), 1);
    bad.splice(bad.indexOf(auth().currentUser.uid), 1);
    if (good.includes(auth().currentUser.uid)) {
      good.splice(good.indexOf(auth().currentUser.uid), 1);
      firestore()
        .collection('posts')
        .doc(postId)
        .update({
          good: good,
        })
        .then(() => {
          setIsGood(!isGood);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      firestore()
        .collection('posts')
        .doc(postId)
        .update({
          important: important,
          good: [...good, auth().currentUser.uid],
          bad: bad,
        })
        .then(() => {
          setIsGood(!isGood);
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    }
  };
  const onPressBad = () => {
    important.splice(important.indexOf(auth().currentUser.uid), 1);
    good.splice(good.indexOf(auth().currentUser.uid), 1);
    if (bad.includes(auth().currentUser.uid)) {
      bad.splice(bad.indexOf(auth().currentUser.uid), 1);
      firestore()
        .collection('posts')
        .doc(postId)
        .update({
          bad: bad,
        })
        .then(() => {
          setIsBad(!isBad);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      firestore()
        .collection('posts')
        .doc(postId)
        .update({
          important: important,
          good: good,
          bad: [...bad, auth().currentUser.uid],
        })
        .then(() => {
          setIsBad(!isBad);
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    }
  };
  const onBookmarkPress = () => {
    setSavedPost(!savedPost);
    if (usersList.includes(auth().currentUser.uid)) {
      usersList.splice(usersList.indexOf(auth().currentUser.uid), 1);
      firestore()
        .collection('posts')
        .doc(postId)
        .update({
          usersList: usersList,
        })
        .then(() => {
          setSavedPost(false);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      firestore()
        .collection('posts')
        .doc(postId)
        .update({
          usersList: [...usersList, auth().currentUser.uid],
        })
        .then(() => {
          setSavedPost(true);
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    }
  };
  const getImageFromStorage = async () => {
    const imagesFromStorage = [];
    for (let i = 0; i < postImages.length; i++) {
      const image = await storage().ref(postImages[i]).getDownloadURL();
      imagesFromStorage.push(image);
    }
    setImages(imagesFromStorage);
  };

  //get images from firebase storage
  useEffect(() => {
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
  const approvePost = () => {
    firestore()
      .collection('posts')
      .doc(postId)
      .update({
        status: 'approved',
      })
      .then(() => {
        Alert.alert('Post approved');
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  };
  const rejectPost = () => {
    firestore()
      .collection('posts')
      .doc(postId)
      .update({
        status: 'rejected',
      })
      .then(() => {
        Alert.alert('Post rejected');
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  };

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
            onPress={() => {
              modalVisible(true);
              myPostId(postId);
            }}
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
          <DoubleClick
            key={image}
            doubleTap={() => setModalImages(true)}
            delay={200}>
            {image.includes('mp4') ? (
              <InViewPort
                onChange={inView => {
                  if (inView) {
                    setVideoPlay(false);
                  } else {
                    setVideoPlay(true);
                  }
                }}>
                <Video
                  source={{uri: image}}
                  style={[styles.postImage, {width: WIDTH}]}
                  shouldPlay
                  repeat
                  paused={!videoPlay} // put pause false to go always
                  useNativeControls
                  resizeMode="cover"
                />
              </InViewPort>
            ) : image?.uri ? (
              <Pdf
                source={{uri: image.uri}}
                style={[styles.postImage, {width: WIDTH}]}
              />
            ) : (
              <Image
                key={uuid.v4()}
                source={{uri: image}}
                style={[styles.postImage, {width: WIDTH}]}
              />
            )}
          </DoubleClick>
        ))}
      </ScrollView>
      <View style={styles.upvotedContent}>
        {userId === auth().currentUser.uid &&
        postAdminId !== auth().currentUser.uid &&
        route.name === 'MyPosts' ? (
          <View style={styles.upvodedButtons}>
            <Text
              style={[
                styles.postStatus,
                {
                  color:
                    postStatus === 'approved'
                      ? 'green'
                      : postStatus === 'rejected'
                      ? 'red'
                      : '#666',
                },
              ]}>
              {postStatus.charAt(0).toUpperCase() + postStatus.slice(1)}
            </Text>
          </View>
        ) : userId !== auth().currentUser.uid &&
          postAdminId === auth().currentUser.uid &&
          route.name == 'MyPosts' ? (
          <View style={styles.bottomRow}>
            <TouchableWithoutFeedback onPress={() => rejectPost()}>
              <View style={styles.postbutton}>
                <Text style={styles.postbuttonText}>Reject</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => approvePost()}>
              <View style={[styles.postbutton, {backgroundColor: '#0356e8'}]}>
                <Text style={styles.postbuttonText}>Approve </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View style={styles.upvotedButtons}>
            <Ionicons
              name={isImportant ? 'alert-circle' : 'alert-circle-outline'}
              style={{color: isImportant ? 'orange' : '#888', fontSize: 25}}
              onPress={() => {
                onPressImportant();
              }}
            />
            <Ionicons
              name={isGood ? 'checkmark-circle' : 'checkmark-circle-outline'}
              style={{color: isGood ? 'green' : '#888', fontSize: 25}}
              onPress={() => {
                onPressGood();
              }}
            />
            <Ionicons
              name={isBad ? 'close-circle' : 'close-circle-outline'}
              style={{color: isBad ? 'red' : '#888', fontSize: 25}}
              onPress={() => {
                onPressBad();
              }}
            />
          </View>
        )}

        <Ionicons
          name={savedPost ? 'bookmark' : 'bookmark-outline'}
          style={{color: savedPost ? 'black' : '#888', fontSize: 25}}
          onPress={() => {
            route.name === 'MyPosts' &&
              postStatus === 'approved' &&
              onBookmarkPress();
            route.name !== 'MyPosts' && onBookmarkPress();
          }}
        />
      </View>
      <View style={styles.hairlineWidth} />
      <Text style={styles.postTitle}>{title}</Text>
      <Text style={styles.postDescription} numberOfLines={seeMore ? 0 : 3}>
        {description}
      </Text>
      <Text style={styles.seeMore} onPress={() => setSeemore(!seeMore)}>
        {seeMore ? 'see less' : 'see more'}
      </Text>
      <View style={styles.bottomRow}>
        <Text style={styles.seePostTime}>{getPostedTime()}</Text>
        <Pressable
          onPress={() => {
            updatePostComments();
            navigation.navigate('Comments', {comments: postComments});
          }}>
          <Text style={styles.seeComments}>{postComments.length} comments</Text>
        </Pressable>
      </View>
      <View style={styles.hairlineWidth} />
      <View style={styles.commentContainer}>
        <Image
          source={{uri: auth().currentUser.photoURL}}
          style={styles.profileImage}
        />
        <TextInput
          style={styles.postComment}
          placeholder="Add a comment..."
          value={comment}
          placeholderTextColor="#999"
          color="#323232"
          onChangeText={text => setComment(text)}
          multiline={true}
        />
        <Text
          style={styles.postCommentButton}
          onPress={() => {
            onPostPress();
            updatePostComments();
          }}>
          Post
        </Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalImages}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView
              onScroll={({nativeEvent}) => onchange(nativeEvent)}
              showHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              style={{width: '100%', height: 400}}>
              {images.map(image => (
                <ImageZoom
                  key={uuid.v4()}
                  cropWidth={WIDTH}
                  cropHeight={HEIGHT}
                  imageWidth={WIDTH - 10}
                  imageHeight={HEIGHT}>
                  {image.includes('mp4') ? (
                    <InViewPort
                      onChange={inView => {
                        if (inView) {
                          setVideoPlay(false);
                        } else {
                          setVideoPlay(true);
                        }
                      }}>
                      <Video
                        source={{uri: image}}
                        style={styles.postImage}
                        shouldPlay
                        repeat
                        poster
                        paused={false}
                        useNativeControls
                      />
                    </InViewPort>
                  ) : (
                    <Image
                      key={uuid.v4()}
                      source={{uri: image}}
                      style={styles.postImage}
                    />
                  )}
                </ImageZoom>
              ))}
            </ScrollView>
          </View>
          <Pressable
            style={styles.closeButton}
            onPress={() => {
              setModalImages(!modalImages);
            }}>
            <Ionicons name="close-circle" style={styles.closeButtonIcon} />
          </Pressable>
        </View>
      </Modal>
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
    backgroundColor: '#fff',
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
    resizeMode: 'cover',
    height: 400,
    width: WIDTH,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
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
    textOverflow: 'ellipsis',
    textAlign: 'justify',
  },
  upvotedContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  commentContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'flex-start',
    paddingVertical: 5,
    backgroundColor: '#fff',
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
  settingButtonIcon: {
    fontSize: 24,
    color: '#323232',
    marginLeft: 'auto',
    marginRight: 20,
  },
  hairlineWidth: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeComments: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 10,
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: '#333',
  },
  modalView: {
    width: '100%',
    paddingVertical: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonIcon: {
    fontSize: 35,
    color: '#fff',
  },
  postStatus: {
    fontSize: 18,
    color: '#aaa',
    fontWeight: 'bold',
  },
  postbutton: {
    width: 80,
    height: 28,
    backgroundColor: 'red',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  postbuttonText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
  },
});
