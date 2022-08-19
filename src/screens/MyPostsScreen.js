import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Post from '../components/Post';
import NoPostsScreen from './NoPostsScreen';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MyPostsScreen() {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    firestore()
      .collection('posts')
      .where('userId', '==', auth().currentUser.uid)
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push({...doc.data(), id: doc.id});
        });
        console.log(docs);
        setPosts(docs);
      });
  }, []);

  const deletePost = postId => {
    firestore().collection('posts').doc(postId).delete();
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
              'https://ps.w.org/cbxuseronline/assets/icon-256x256.png?rev=2284897'
            }
            userProfileName={post.postUserName}
            location="Bucharest, Romania"
            postImages={post.images}
            title={post.title}
            description={post.description}
            bookmarkStatus={post.bookmark}
            createdAt={post.createdAt}
            modalVisible={setModalVisible}
            usersList={post.usersList}
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
                      deletePost(post.id);
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
