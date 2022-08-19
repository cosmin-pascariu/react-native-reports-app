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
          docs.push(doc.data());
        });
        console.log(docs);
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
            modalVisible={setModalVisible}
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
                <TouchableOpacity
                  style={{width: 24, height: 24}}
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Ionicons name="ios-close" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <View style={styles.modalButton}>
                    <Ionicons name="trash" size={24} color="black" />
                    <Text style={{fontSize: 20, color: '#f00'}}>Delete</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <View style={styles.modalButton}>
                    <Ionicons name="ios-share" size={24} color="black" />
                    <Text style={{fontSize: 20, color: '#0357e8'}}>Edit</Text>
                  </View>
                </TouchableOpacity>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    height: '20%',
    padding: 10,
  },
  modalText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#aaa',
    flexDirection: 'row',
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
