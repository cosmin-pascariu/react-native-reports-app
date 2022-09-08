import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  Dimensions,
  Modal,
  Alert,
  PermissionsAndroid,
  DevSettings,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useFormik} from 'formik';
import SelectDropdown from 'react-native-select-dropdown';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default function MyProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [inputVisibility, setInputVisibility] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [signOutButton, setSignOutButton] = useState(false);
  const [updatePasswordVisibility, setUpdatePasswordVisibility] =
    useState(false);
  const [deleteAccountVisibility, setDeleteAccountVisibility] = useState(false);

  const profileData = {
    userId: '',
    userName: '',
    userEmail: '',
    userPassword: '',
    userNewPassword: '',
    userConfirmPassword: '',
    userProfileImage: '',
    userLocation: '',
  };

  function refreshPage() {
    window.location.reload(false);
  }

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
    onSubmit: () => {
      updateUser();
      updateUserData();
      route?.name === 'SetupProfileScreen' &&
        DevSettings.reload() &&
        name !== '';
    },
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
    location,
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

  const loadUserData = userId => {
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
          setFieldValue('location', doc.data().location);
        });
      });
  };

  // load data from firebase
  useEffect(() => {
    const userId = auth().currentUser.uid;
    loadUserData(userId);
    route?.name === 'SetupProfileScreen' && setInputVisibility(true);
  }, []);

  // update user profile image
  const updateUserProfileImage = filename => {
    storage()
      .ref(filename)
      .getDownloadURL()
      .then(url => {
        firestore()
          .collection('users')
          .doc(userId)
          .update({
            name,
            email,
            password,
            profileImage: url,
            location,
          })
          .then(() => {
            setFieldValue('profileImage', url);
          })
          .catch(error => {
            console.log(error);
          });
      });
  };

  // update auth user profile image
  const updateAuthUserProfileImage = filename => {
    console.log('updateAuthUserProfileImage');
    storage()
      .ref(filename)
      .getDownloadURL()
      .then(url => {
        auth()
          .currentUser.updateProfile({
            photoURL: url,
          })
          .catch(error => {
            console.log(error);
          });
      });
  };

  // update post user profile image
  const updatePostUserProfileImage = filename => {
    console.log('updatePostUserProfileImage');
    storage()
      .ref(filename)
      .getDownloadURL()
      .then(url => {
        firestore()
          .collection('posts')
          .where('userId', '==', userId)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              firestore()
                .collection('posts')
                .doc(doc.id)
                .update({
                  postUserProfilePicture: url,
                })
                .catch(error => {
                  console.log(error);
                });
            }),
              () => {
                console.log('done');
              };
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  // update user Data in firebase
  const updateUser = async () => {
    let filename = profileImage.substring(profileImage.lastIndexOf('/') + 1);
    // Add timestamp to filename to avoid name collisions
    const extension = filename.split('.').pop();
    const nameOfImage = filename.split('.').slice(0, -1).join('.');
    filename = nameOfImage + Date.now() + '.' + extension;
    try {
      await storage().ref(filename).putFile(profileImage);
    } catch (error) {
      console.log(error);
    }
    updateUserProfileImage(filename);
    updateAuthUserProfileImage(filename);
    updatePostUserProfileImage(filename);
    setInputVisibility(false);
    Alert.alert('Profile updated!');
  };

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
      });
  };

  const deleteAccount = async () => {
    await firestore()
      .collection('users')
      .doc(userId)
      .delete()
      .then(() => {
        firestore()
          .collection('posts')
          .where('userId', '==', auth().currentUser.uid)
          .onSnapshot(snapshot => {
            snapshot.forEach(doc => {
              firestore().collection('posts').doc(doc.id).delete();
            });
          });
      });
    await auth()
      .currentUser.delete()
      .then(() => {
        console.log('User account deleted!');
      });
    setInputVisibility(false);
  };

  const updateUserData = () => {
    firestore()
      .collection('users')
      .doc(userId)
      .update({
        name,
        email,
        password,
        // profileImage,
        location,
      })
      .then(() => {
        Alert.alert('Profile updated!');
      })
      .catch(error => {
        console.log(error);
      });
    auth()
      .currentUser.updateProfile({
        displayName: name,
      })
      .catch(error => {
        console.log(error);
      });
  };

  const locations = fetch('https://roloca.coldfuse.io/judete')
    .then(response => response.json())
    .then(json => {
      return json;
    })
    .catch(error => {
      console.error(error);
    });

  const getLocations = () => {
    let locationsArray = [];
    locations.then(data => {
      data.forEach(location => {
        locationsArray.push(location.nume);
      });
    });
    return locationsArray;
  };

  useEffect(() => {
    getLocations();
  }, []);

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
          {route?.name !== 'SetupProfileScreen' && (
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={() => {
                setModalVisible(true);
                setSignOutButton(true);
              }}>
              <Ionicons name="md-log-out" size={25} color="#323232" />
            </TouchableOpacity>
          )}
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
          <Text style={styles.label}>Location</Text>
          {touched.location && errors.location && (
            <Text style={styles.errorMessage}>{errors.location}</Text>
          )}
        </View>
        <SelectDropdown
          data={getLocations()}
          onSelect={(selectedItem, index) => {
            setFieldValue('location', selectedItem);
          }}
          defaultButtonText={location}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          buttonStyle={styles.dropdownButton}
          buttonTextStyle={styles.dropdownButtonText}
          // buttonStyle={{width: '100%', margin: 0, padding: 0}}
          // renderCustomizedButtonChild={(selectedItem, index) => {
          //   return (
          //     <View style={styles.dropdownButton}>
          //       <Text style={styles.dropdownButtonText}>
          //         {selectedItem || 'Select location'}
          //       </Text>
          //     </View>
          //   );
          // }}
          renderDropdownIcon={() => {
            return (
              <Ionicons
                name="md-arrow-down-circle"
                size={25}
                color="#323232"
                style={styles.dropdownIcon}
              />
            );
          }}
          dropdownIconPosition="right"
          dropdownStyle={{borderRadius: 10}}
          rowStyle={{width: '100%'}}
          rowTextStyle={{textAlign: 'left'}}
          disabled={!inputVisibility}
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
          editable={inputVisibility && route?.name !== 'SetupProfileScreen'}
        />
        <View style={styles.rowLabel}>
          <Text style={styles.label}>Password</Text>
          {touched.password && errors.password && (
            <Text style={styles.errorMessage}>{errors.password}</Text>
          )}
        </View>
        <View>
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
          {inputVisibility && route?.name !== 'SetupProfileScreen' && (
            <Pressable
              style={styles.updateButton}
              onPress={() => {
                setUpdatePasswordVisibility(!updatePasswordVisibility);
              }}>
              <Text style={styles.updateButtonText}>
                {updatePasswordVisibility ? 'Cancel' : 'Edit'}
              </Text>
            </Pressable>
          )}
        </View>
        {updatePasswordVisibility && (
          <View>
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
              editable={
                updatePasswordVisibility && route?.name !== 'SetupProfileScreen'
              }
              secureTextEntry={true}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          {inputVisibility ? (
            <>
              <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  if (route?.name === 'SetupProfileScreen') {
                    signOut();
                  } else {
                    setInputVisibility(false);
                    setUpdatePasswordVisibility(false);
                    loadUserData(auth().currentUser.uid);
                  }
                }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, {width: WIDTH - 50}]}
                onPress={() => {
                  setInputVisibility(true);
                  console.log(route);
                }}>
                <Text style={styles.buttonText}>Edit Fields</Text>
              </Pressable>
            </View>
          )}
        </View>
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            {!signOutButton && !deleteAccountVisibility && (
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

            <Text style={styles.modalText}>
              {signOutButton &&
                !deleteAccountVisibility &&
                'Are you sure you want to sign out?'}
              {deleteAccountVisibility &&
                'Are you sure you want to delete your account?'}
            </Text>
            <View style={styles.modalButtonContainer}>
              {signOutButton && !deleteAccountVisibility && (
                <Pressable style={styles.modalButton} onPress={() => signOut()}>
                  <Text style={styles.buttonText}>Sign out</Text>
                </Pressable>
              )}
              {deleteAccountVisibility && (
                <Pressable
                  style={styles.modalButton}
                  onPress={() => deleteAccount()}>
                  <Text style={styles.buttonText}>Agree</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  setSignOutButton(false);
                  setDeleteAccountVisibility(false);
                }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
            {signOutButton && (
              <Pressable
                style={[styles.modalButton, {backgroundColor: '#f00'}]}
                onPress={() => setDeleteAccountVisibility(true)}>
                <Text style={styles.buttonText}>Delete account</Text>
              </Pressable>
            )}
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
    marginVertical: 'auto',
    // height: HEIGHT - 150,
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
    width: '100%',
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
    right: 4,
    top: 12,
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
  modalText: {
    fontSize: 18,
    color: '#323232',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#323232',
    textDecoration: 'none',
    textAlign: 'left',
    marginLeft: 5,
  },
  dropdownButton: {
    height: 40,
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#323232',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
    marginBottom: 10,
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
  location: Yup.string().required('Required'),
});

// const reauthenticate = currentPassword => {
//   var user = auth().currentUser;
//   var cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
//   return user.reauthenticateWithCredential(cred);
// };

// const updateUserPassword = async () => {
//   if (newPassword === confirmPassword) {
//     await reauthenticate(password)
//       .then(() => {
//         var user = auth().currentUser;
//         user
//           .updatePassword(newPassword)
//           .then(() => {
//             console.log('Password updated!');
//             setUpdatePasswordVisibility(false);
//             setFieldValue('password', newPassword);
//             setFieldValue('newPassword', '');
//             setFieldValue('confirmPassword', '');
//             Alert.alert('Password updated!');
//           })
//           .catch(error => {
//             console.log(error);
//           });
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   } else {
//     Alert.alert('Password does not match!');
//   }
// };

// const updateUserEmail = async () => {
//   // if (email !== auth().currentUser.email) {
//   //   await reauthenticate(password)
//   //     .then(() => {
//   //       var user = auth().currentUser;
//   //       user
//   //         .updateEmail(email)
//   //         .then(() => {
//   //           setUpdatePasswordVisibility(false);
//   //           setFieldValue('password', newPassword);
//   //           setFieldValue('newPassword', '');
//   //           setFieldValue('confirmPassword', '');
//   //           Alert.alert('Password updated!');
//   //         })
//   //         .catch(error => {
//   //           console.log(error);
//   //         });
//   //     })
//   //     .catch(error => {
//   //       console.log(error);
//   //     });
//   // } else {
//   //   Alert.alert('Same email!');
//   // }

//   await auth()
//     .currentUser.updateEmail(email)
//     .then(() => {
//       console.log('Email updated!');
//       setUpdatePasswordVisibility(false);
//     })
//     .catch(error => {
//       Alert.alert(error);
//     });
// };
