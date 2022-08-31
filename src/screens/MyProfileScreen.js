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
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import {useFormik} from 'formik';
import * as Yup from 'yup';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default function MyProfileScreen() {
  const [inputVisibility, setInputVisibility] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [signOutButton, setSignOutButton] = useState(false);
  const [updatePasswordVisibility, setUpdatePasswordVisibility] =
    useState(false);

  const profileData = {
    userId: '',
    userName: '',
    userEmail: '',
    userPassword: '',
    userNewPassword: '',
    userConfirmPassword: '',
    userProfileImage: '',
  };

  //FORMIK
  const {
    handleSubmit,
    handleChange,
    values,
    setFieldValue,
    touched,
    handleBlur,
    errors,
  } = useFormik({
    initialValues: profileData,
    onSubmit: () => updateUser(),
    validationSchema: validationSchema,
  });

  /// Destructuring the params
  const {
    userId,
    name,
    email,
    password,
    newPassword,
    confirmPassword,
    profileImage,
  } = values;

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: WIDTH,
      height: HEIGHT / 2 - 20,
      cropping: true,
    })
      .then(image => {
        setFieldValue('profileImage', image.path);
        setModalVisible(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const takePhotoFromGallery = () => {
    ImagePicker.openPicker({
      width: WIDTH,
      height: HEIGHT / 2 - 20,
    })
      .then(image => {
        setFieldValue('profileImage', image.path);
        setModalVisible(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // load data from firebase
  useEffect(() => {
    const userId = auth().currentUser.uid;
    firestore()
      .collection('users')
      .where('uid', '==', userId)
      .onSnapshot(doc => {
        doc.forEach(doc => {
          setFieldValue('userId', doc.id);
          setFieldValue('name', doc.data().name);
          setFieldValue('email', doc.data().email);
          setFieldValue('password', doc.data().password);
          setFieldValue('profileImage', doc.data().profileImage);
        });
      });
  }, []);

  // update user Data in firebase
  const updateUser = () => {
    console.log('userId', userId);
    firestore()
      .collection('users')
      .doc(userId)
      .update({
        name: name,
        email: email,
        password: password,
        profileImage: profileImage,
      })
      .then(() => {
        setInputVisibility(false);
        Alert.alert('Success', 'User updated successfully');
      })
      .catch(error => {
        console.error('Error updating document: ', error);
      });
    auth().currentUser.updateProfile({
      displayName: name,
      photoURL: profileImage,
      email: email,
      password: password,
    });
    firestore()
      .collection('posts')
      .where('userId', '==', auth().currentUser.uid)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          firestore().collection('posts').doc(doc.id).update({
            postUserName: name,
            postUserProfilePicture: profileImage,
          });
        });
      });
  };

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
      });
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{uri: profileImage}} style={styles.profileImage} />
          {inputVisibility && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalVisible(true)}>
              <Ionicons name="md-create" size={25} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => {
              setModalVisible(true);
              setSignOutButton(true);
            }}>
            <Ionicons name="md-log-out" size={25} color="#323232" />
          </TouchableOpacity>
        </View>
        <View style={styles.rowLabel}>
          <Text style={styles.label}>Name</Text>
          {touched.name && errors.name && (
            <Text style={styles.errorMessage}>{errors.name}</Text>
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Insert your name"
          value={name}
          color="#323232"
          placeholderTextColor="#999"
          onChangeText={handleChange('name')}
          onBlur={handleBlur('name')}
          editable={inputVisibility}
        />
        <View style={styles.rowLabel}>
          <Text style={styles.label}>Email</Text>
          {touched.email && errors.email && (
            <Text style={styles.errorMessage}>{errors.email}</Text>
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Insert your email"
          value={email}
          color="#323232"
          placeholderTextColor="#999"
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          editable={inputVisibility}
        />
        <View style={styles.rowLabel}>
          <Text style={styles.label}>Password</Text>
          {touched.password && errors.password && (
            <Text style={styles.errorMessage}>{errors.password}</Text>
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Insert your password"
          value={password}
          color="#323232"
          placeholderTextColor="#999"
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          editable={updatePasswordVisibility}
          secureTextEntry={true}
        />
        {inputVisibility && (
          <Pressable
            onPress={() =>
              setUpdatePasswordVisibility(!updatePasswordVisibility)
            }>
            <View style={styles.updateButton}>
              <Text style={styles.updateButtonText}>
                {updatePasswordVisibility ? 'Cancel' : 'Edit'}
              </Text>
            </View>
          </Pressable>
        )}
        {updatePasswordVisibility && (
          <>
            <View style={styles.rowLabel}>
              <Text style={styles.label}>New Password</Text>
              {touched.newPassword && errors.newPassword && (
                <Text style={styles.errorMessage}>{errors.newPassword}</Text>
              )}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Insert your new password"
              value={newPassword}
              color="#323232"
              placeholderTextColor="#999"
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              editable={updatePasswordVisibility}
              secureTextEntry={true}
            />
            <View style={styles.rowLabel}>
              <Text style={styles.label}>Confirm New Password</Text>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorMessage}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              color="#323232"
              placeholderTextColor="#999"
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              editable={updatePasswordVisibility}
              secureTextEntry={true}
            />
          </>
        )}

        <View style={styles.buttonContainer}>
          {inputVisibility ? (
            <>
              <Pressable style={styles.button} onPress={handleSubmit}>
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
            {!signOutButton && (
              <View style={styles.modalButtonContainer}>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => takePhotoFromCamera()}>
                  <Text style={styles.buttonText}>Take Photo</Text>
                </Pressable>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => takePhotoFromGallery()}>
                  <Text style={styles.buttonText}>Choose Photo</Text>
                </Pressable>
              </View>
            )}

            <View style={styles.modalButtonContainer}>
              {signOutButton && (
                <Pressable style={styles.modalButton} onPress={() => signOut()}>
                  <Text style={styles.buttonText}>Sign out</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  setSignOutButton(false);
                }}>
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
    width: WIDTH - 40,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
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
  rowLabel: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    right: '20%',
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
  errorMessage: {
    color: '#ff0000',
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
    marginBottom: 10,
  },
  signOutButton: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  updateButton: {
    position: 'absolute',
    top: -58,
    right: 4,
    width: 60,
    height: 36,
    backgroundColor: '#0356e8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  updateButtonText: {
    fontSize: 14,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
});

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required').min(6, 'Too Short!'),
  email: Yup.string().required('Required'),
  password: Yup.string()
    .required('Required')
    .min(8, 'Password must be at least 8 characters'),
  newPassword: Yup.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string().test(
    'passwords-match',
    'Passwords must match',
    function (value) {
      return this.parent.newPassword === value;
    },
  ),
});
