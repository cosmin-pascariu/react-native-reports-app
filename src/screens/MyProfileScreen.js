import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default function MyProfileScreen() {
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [inputVisibility, setInputVisibility] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: WIDTH,
      height: HEIGHT / 2 - 20,
      cropping: true,
    })
      .then(image => {
        setProfileImage(image);
        setModalVisible(false);
        updateProfileImage(image);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const takeMultiplePhotos = () => {
    ImagePicker.openPicker({
      width: WIDTH,
      height: HEIGHT / 2 - 20,
    })
      .then(image => {
        setProfileImage(image);
        setModalVisible(false);
        updateProfileImage(image);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    const userId = auth().currentUser.uid;
    firestore()
      .collection('users')
      .where('uid', '==', userId)
      .onSnapshot(doc => {
        doc.forEach(doc => {
          setUserID(doc.id);
          setUserName(doc.data().name);
          setUserEmail(doc.data().email);
          setUserPassword(doc.data().password);
        });
      });
    updateProfileImage(profileImage);
  }, []);

  const updateProfileImage = image => {
    if (image) {
      const update = {
        photoURL: image.path,
      };
      console.log('Image path: ' + image.path);
      auth().currentUser.updateProfile(update);
      firestore().collection('users').doc(userID).update({
        profileImage: image.path,
      });
    }
  };

  const updateUser = () => {
    console.log('userIDd', userID);
    firestore()
      .collection('users')
      .doc(userID)
      .update({
        name: userName,
        email: userEmail,
        password: userPassword,
        // profileImage: profileImage.path,
      })
      .then(() => {
        setInputVisibility(false);
        Alert.alert('Success', 'User updated successfully');
      })
      .catch(error => {
        console.error('Error updating document: ', error);
      });
    auth().currentUser.updateProfile({
      displayName: userName,
    });
    firestore()
      .collection('posts')
      .where('userId', '==', auth().currentUser.uid)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          firestore().collection('posts').doc(doc.id).update({
            postUserName: userName,
          });
        });
      });
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: auth().currentUser.photoURL}}
            style={styles.profileImage}
          />
          {inputVisibility && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalVisible(true)}>
              <Ionicons name="md-create" size={25} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{userName}</Text>
        </View>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Insert your name"
          value={userName}
          onChangeText={text => setUserName(text)}
          editable={inputVisibility}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Insert your email"
          value={userEmail}
          onChangeText={text => setUserEmail(text)}
          editable={inputVisibility}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Insert your password"
          value={userPassword}
          onChangeText={text => setUserPassword(text)}
          editable={inputVisibility}
          secureTextEntry={true}
        />
        <View style={styles.buttonContainer}>
          {inputVisibility ? (
            <>
              <Pressable style={styles.button} onPress={() => updateUser()}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setInputVisibility(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, {width: WIDTH - 50}]}
                onPress={() => setInputVisibility(true)}>
                <Text style={styles.buttonText}>Edit Fields</Text>
              </Pressable>
            </View>
          )}
        </View>
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={styles.modalButton}
                onPress={() => takePhotoFromCamera()}>
                <Text style={styles.buttonText}>Take Photo</Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => takeMultiplePhotos()}>
                <Text style={styles.buttonText}>Choose Photo</Text>
              </Pressable>
            </View>

            <View style={styles.modalButtonContainer}>
              <Pressable
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,

    marginLeft: 'auto',
    marginRight: 'auto',
  },
  profileImage: {
    resizeMode: 'cover',
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: '#323232',
    borderRadius: 100,
  },
  label: {
    fontSize: 14,
    color: '#303030',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    marginHorizontal: 2,
    textDecoration: 'none',
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
  editButton: {
    position: 'absolute',
    right: 0,
    top: 150,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
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
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 18,
    color: '#303030',
    textDecoration: 'none',

    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    height: 40,
    width: '45%',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#0356e8',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 20,
    height: 40,
    width: '50%',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#f00',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalButton: {
    height: 40,
    width: '45%',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#0356e8',
    borderRadius: 8,
  },
});
