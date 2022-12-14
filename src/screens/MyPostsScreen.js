import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Post from '../components/Post';
import NoPostsScreen from './NoPostsScreen';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, CommonActions} from '@react-navigation/native';

export default function MyPostsScreen() {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [myPostId, setMyPostId] = useState(null);
  const navigation = useNavigation();

  // get post according to admin approval
  const getMyPosts = () => {
    firestore()
      .collection('users')
      .where('uid', '==', auth().currentUser.uid)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          doc.data().admin ? getAdminPosts() : getPostsByUserId(doc.data().uid);
        });
      });
  };
  const getAdminPosts = () => {
    firestore()
      .collection('posts')
      .where('status', '==', 'on review')
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push({...doc.data(), id: doc.id});
        });
        setPosts(docs);
      });
  };
  const getPostsByUserId = userId => {
    firestore()
      .collection('posts')
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          if (doc.data().userId === userId) {
            docs.push({...doc.data(), id: doc.id});
          }
        });
        setPosts(docs);
      });
  };

  useEffect(() => {
    getMyPosts();
  }, []);

  const deletePostHandler = () => {
    deleteMediaFromStorage();
    firestore()
      .collection('posts')
      .doc(myPostId)
      .delete()
      .then(() => {
        setModalVisible(false);
        setMyPostId(null);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setMyPostId(null);
        setModalVisible(false);
      });
  };
  const deleteMediaFromStorage = () => {
    firestore()
      .collection('posts')
      .doc(myPostId)
      .get()
      .then(doc => {
        if (doc.exists) {
          postImages = doc.data().images;
          for (let i = 0; i < postImages.length; i++) {
            storage().ref(postImages[i]).delete();
          }
        }
      });
  };

  return (
    <ScrollView>
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
            modalVisible={setModalVisible}
            usersList={post.usersList}
            myPostId={setMyPostId}
            important={post.important}
            good={post.good}
            bad={post.bad}
            comments={post.comments}
            postStatus={post.status}
            postAdminId={post.adminId}
          />
        ))}
        {posts.length === 0 && <NoPostsScreen />}
        {modalVisible && (
          <Modal
            visible={modalVisible}
            animationType="fade"
            transparent={true}
            hardwareAccelerated={true}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
            <TouchableOpacity
              style={styles.modalContainer}
              onPressOut={() => setModalVisible(false)}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>Please Confirm</Text>
                  <Text style={styles.modalText}>Are you sure?</Text>
                </View>
                <View style={styles.hairlineWidth} />
                <View style={styles.modalBody}>
                  <TouchableOpacity
                    onPress={() => {
                      deletePostHandler();
                      Alert.alert('Post deleted');
                    }}>
                    <View style={styles.modalButton}>
                      <Text style={{fontSize: 16, color: '#f00'}}>Delete</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.hairlineVertical} />
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                    }}>
                    <View style={styles.modalButton}>
                      <Text style={{fontSize: 16, color: '#666'}}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.hairlineVertical} />
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [
                            {
                              name: 'Add',
                              params: {postId: myPostId, edit: true},
                            },
                          ],
                        }),
                      );
                    }}>
                    <View style={styles.modalButton}>
                      <Text style={{fontSize: 16, color: '#0357e8'}}>Edit</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '70%',
    height: '15%',
    // padding: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  modalButton: {
    height: 40,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modalHeader: {
    marginTop: 10,
    height: '55%',
    width: '100%',
  },
  modalHeaderText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  modalBody: {
    height: '35%',
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  hairlineWidth: {
    width: '100%',
    height: 2,
    backgroundColor: '#ccc',
  },
  hairlineVertical: {
    width: 1,
    height: '100%',
    backgroundColor: '#ccc',
  },
});
