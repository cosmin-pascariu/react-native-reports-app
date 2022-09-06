import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  Image,
  View,
  Alert,
  Button,
  Dimensions,
  Platform,
  Modal,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Pressable,
  TouchableHighlight,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Textarea from '../components/Textarea';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {
  useNavigation,
  useIsFocused,
  CommonActions,
} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
// import Video from 'react-native-video';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

Geocoder.init('AIzaSyAj_B3UnNBrTZE9i_wHuVgnXZ74HQgExHQ');

export default function AddScreen({route, navigation}) {
  const postData = {
    title: '',
    description: '',
    location: '',
    images: [],
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
    initialValues: postData,
    onSubmit: () => {
      route?.params?.edit ? editPost() : submitPost();
    },
    validationSchema: validationSchema,
  });

  /// Destructuring the params
  const {title, description, images, location} = values;

  // is focused is used to check if the screen is focused or not
  const isFocused = useIsFocused();
  const [modalVisibility, setModalVisibility] = useState(true);
  const [deleteImageModalVisibility, setDeleteImageModalVisibility] =
    useState(false);
  const [adminId, setAdminId] = useState();

  const checkIsFocused = () => {
    // debugger;
    if (!isFocused) {
      setModalVisibility(true);
    }
  };

  const [currentUserId, setCurrentUserId] = useState('');
  const [currentPostId, setCurrentPostId] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);

  const [image, setImage] = useState(null);
  const [imagesFromStorage, setImagesFromStorage] = useState([]);

  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);

  const getImageFromStorage = async receivedImages => {
    const imagesStorage = [];
    for (let i = 0; i < receivedImages.length; i++) {
      const image = await storage().ref(receivedImages[i]).getDownloadURL();
      imagesStorage.push(image);
    }
    setImagesFromStorage(imagesStorage);
  };

  const autocompleteFields = () => {
    if (route?.params?.edit) {
      firestore()
        .collection('posts')
        .doc(route.params.postId)
        .get()
        .then(doc => {
          setFieldValue('title', doc.data().title);
          setFieldValue('description', doc.data().description);
          setFieldValue('location', doc.data().location);
          setFieldValue('images', doc.data().images);
          getImageFromStorage(doc.data().images);
          setMarkers([
            {
              key: markers.length,
              coords: {
                latitude: doc.data().coordinates.latitude,
                longitude: doc.data().coordinates.longitude,
              },
              pinColor: '#f00',
              title: 'Problem Location',
              description: 'The problem is here',
            },
          ]);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  function getMyLocation() {
    Geolocation.getCurrentPosition(
      info => {
        setRegion({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      () => {
        console.log('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 2000,
      },
    );
  }

  function newMarker(e) {
    const latitude = e.nativeEvent.coordinate.latitude;
    const longitude = e.nativeEvent.coordinate.longitude;

    let datas = {
      key: markers.length,
      coords: {
        latitude: latitude,
        longitude: longitude,
      },
      pinColor: '#f00',
      title: 'Problem Location',
      description: 'The problem is here',
    };
    setRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setMarkers([datas]);

    Geocoder.from(latitude, longitude)
      .then(json => {
        const address = json.results[0].formatted_address;
        setFieldValue('location', address);
      })
      .catch(error => console.log(error));
  }
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: WIDTH,
      height: HEIGHT / 2 - 20,
      cropping: true,
    })
      .then(image => {
        setFieldValue('images', [...images, image]);
        getAdminId();
      })
      .catch(err => {
        console.log(err);
      });
  };
  const takeMultiplePhotos = () => {
    ImagePicker.openPicker({
      multiple: true,
      width: WIDTH,
      height: HEIGHT / 2 - 20,
    })
      .then(images => {
        setFieldValue('images', images);
        getAdminId();
      })
      .catch(err => {
        console.log(err);
      });
  };
  const takeVideoFromCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
    })
      .then(video => {
        setFieldValue('images', [...images, video]);
        getAdminId();
      })
      .catch(err => {
        console.log(err);
      });
  };
  const takeVideoFromGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then(video => {
        setFieldValue('images', [...images, video.path]);
        getAdminId();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const submitPost = async () => {
    let imagesPath = [];
    const promises = images.map(async image => {
      const uploadUri = Platform.OS === 'ios' ? image.uri : image.path;
      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

      // Add timestamp to filename to avoid name collisions
      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
      filename = name + Date.now() + '.' + extension;

      try {
        await storage().ref(filename).putFile(uploadUri);
        imagesPath.push(filename);
      } catch (error) {
        console.log(error);
      }
    });
    await Promise.all(promises);
    const post = {
      userId: auth().currentUser.uid,
      postUserName: auth().currentUser.displayName,
      postUserProfilePicture: auth().currentUser.photoURL,
      images: imagesPath,
      title: title,
      location: location,
      coordinates: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      description: description,
      important: [],
      good: [],
      bad: [],
      createdAt: new Date(),
      usersList: [],
      comments: [],
      adminId: adminId,
      status: 'on review',
    };
    await firestore().collection('posts').add(post);
    Alert.alert('Success', 'Post added successfully');
    setFieldValue('title', '');
    setFieldValue('description', '');
    setFieldValue('images', []);
    setFieldValue('location', '');
    setMarkers([]);
  };
  const formatImages = imagesToBeFormated => {
    let imagesPath = [];
    console.log(imagesToBeFormated);
    const promises = imagesToBeFormated.map(async image => {
      const uploadUri = Platform.OS === 'ios' ? image.uri : image.path;
      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

      // Add timestamp to filename to avoid name collisions
      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
      filename = name + Date.now() + '.' + extension;

      try {
        await storage().ref(filename).putFile(uploadUri);
        imagesPath.push(filename);
      } catch (error) {
        console.log(error);
      }
    });
    return imagesPath;
  };
  const editPost = async () => {
    let imagesPath = formatImages(images);
    const updatedPost = {
      title: title,
      description: description,
      // images: imagesPath,
      location: location,
      coordinates: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
    };
    console.log('Formated images: ', formatImages(images));
    console.log('UPDATED POST', updatedPost);
    await firestore()
      .collection('posts')
      .doc(route?.params?.postId)
      .update(updatedPost);
    Alert.alert('Success', 'Post updated successfully');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}, {name: 'Add'}],
      }),
    );
  };
  // get admin Id
  const getAdminId = async () => {
    let userId;
    const user = await firestore()
      .collection('users')
      .where('admin', '==', true)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setAdminId(doc.data().uid);
        });
      });
  };
  useEffect(() => {
    checkIsFocused();
    getMyLocation();
    if (route?.params?.edit) {
      autocompleteFields();
    }
  }, [route?.params?.edit, isFocused]);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.rowLabel}>
          <Text style={styles.label}>Title</Text>
          {touched.title && errors.title && (
            <Text style={styles.errorMessage}>{errors.title}</Text>
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Insert title"
          color="#323232"
          placeholderTextColor="#999"
          value={title}
          onChangeText={handleChange('title')}
          onBlur={handleBlur('title')}
        />
        <View style={styles.rowLabel}>
          <Text style={styles.label}>Description</Text>
          {touched.description && errors.description && (
            <Text style={styles.errorMessage}>{errors.description}</Text>
          )}
        </View>
        <Textarea
          textareaValue={description}
          onchangetext={handleChange('description')}
          onblur={handleBlur('description')}
        />
        <View style={styles.rowLabel}>
          <Text
            style={styles.label}
            onPress={() => {
              // getImageFromStorage(images);
              console.log(images);
            }}>
            Media
          </Text>
          {touched.images && errors.images && (
            <Text style={styles.errorMessage}>{errors.images}</Text>
          )}
        </View>
        <View style={styles.mediaButtons}>
          <TouchableWithoutFeedback onPress={takePhotoFromCamera}>
            <View style={styles.customImgButton}>
              <Image
                source={require('../assets/camera.png')}
                style={styles.customImgBackground}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={takeMultiplePhotos}>
            <View style={styles.customImgButton}>
              <Image
                source={require('../assets/gallery.png')}
                style={styles.customImgBackground}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.mediaButtons}>
          <TouchableWithoutFeedback onPress={takeVideoFromCamera}>
            <View style={styles.customImgButton}>
              <Image
                source={require('../assets/camera.png')}
                style={styles.customImgBackground}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={takeVideoFromGallery}>
            <View style={styles.customImgButton}>
              <Image
                source={require('../assets/gallery.png')}
                style={styles.customImgBackground}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        {images.length > 0 && (
          <>
            <Text style={{color: '#323232'}}>
              Keep long press to delete an image
            </Text>
            <View style={styles.loadedImages}>
              {imagesFromStorage.length > 0
                ? imagesFromStorage.map((image, index) => (
                    <Image
                      key={index}
                      source={{uri: image}}
                      style={styles.loadedImage}
                    />
                  ))
                : images.map((image, index) => (
                    <TouchableHighlight
                      key={index}
                      style={styles.loadedImage}
                      onLongPress={() => {
                        setDeleteImageModalVisibility(true);
                        setSelectedImage(image);
                      }}>
                      <Image
                        key={index}
                        source={{uri: image.path}}
                        style={styles.loadedImage}
                      />
                    </TouchableHighlight>
                  ))}
            </View>
          </>
        )}
        <View style={styles.rowLabel}>
          <Text style={styles.label}>Location</Text>
          {touched.location && errors.location && (
            <Text style={styles.errorMessage}>{errors.location}</Text>
          )}
        </View>
        <MapView
          onMapReady={() => {
            Platform.OS !== 'ios'
              ? PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                )
              : navigation.navigate('HomeScreen');
          }}
          style={styles.map}
          region={region}
          zoomEnabled={true}
          showsUserLocation={true}
          locationEnabled={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          showsIndoors={true}
          showsIndoorLevelPicker={true}
          showsPointsOfInterest={true}
          onPress={e => newMarker(e)}>
          {markers.map(marker => (
            <Marker
              key={marker.key}
              coordinate={marker.coords}
              pinColor={marker.pinColor}
              title={marker.title}
              description={marker.description}
              onValueChange={itemValue =>
                setFieldValue('location', postData.location)
              }
            />
          ))}
        </MapView>
        <TouchableOpacity onPress={handleSubmit}>
          <View style={styles.submitButton}>
            <Text style={styles.submitButtonText}>
              {route?.params?.edit ? `Edit` : `Submit`}
            </Text>
          </View>
        </TouchableOpacity>
        {route?.params?.edit && !isFocused && (
          <Modal visible={modalVisibility} transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>
                  Are you sure you want to leave? Your changes will not be
                  saved.
                </Text>
                <View style={styles.rowLabel}>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      setModalVisibility(false);
                      navigation.navigate('Add', {edit: true});
                    }}>
                    <Text style={{color: 'white'}}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      setModalVisibility(false);
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{name: 'Home'}, {name: 'Add'}],
                        }),
                      );
                    }}>
                    <Text style={{color: 'white'}}>OK</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        )}
        {deleteImageModalVisibility && (
          <Modal visible={deleteImageModalVisibility} transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>
                  Are you sure you want to delete this image?
                </Text>
                <View style={styles.rowLabel}>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      setDeleteImageModalVisibility(false);
                    }}>
                    <Text style={{color: 'white'}}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      setDeleteImageModalVisibility(false);
                      setFieldValue(
                        'images',
                        images.filter(item => item !== selectedImage),
                      );
                      setSelectedImage(null);
                    }}>
                    <Text style={{color: 'white'}}>OK</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
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
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 1,
  },
  loadedImages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 20,
  },
  loadedImage: {
    width: WIDTH / 2 - 20,
    height: WIDTH / 2 - 20,
    marginBottom: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
    resizeMode: 'cover',
    backgroundColor: '#000',
    borderRadius: 25,
  },
  progress: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#303030',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  map: {
    width: WIDTH - 30,
    height: HEIGHT / 2 - 20,
    backgroundColor: '#000',
  },
  customImgButton: {
    width: WIDTH / 2 - 20,
    height: WIDTH / 2 - 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
  customImgBackground: {
    width: '75%',
    height: '75%',
    resizeMode: 'cover',
    borderRadius: 25,
  },
  submitButton: {
    width: WIDTH - 30,
    height: 50,
    borderRadius: 12,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0356e8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#ff0000',
  },
  rowLabel: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    color: '#303030',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  modalButton: {
    fontSize: 16,
    height: 50,
    width: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0356e8',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  modalButtonTextCancel: {
    fontSize: 16,
    color: '#0356e8',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  modalButtonTextOk: {
    fontSize: 16,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
});

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(6, 'At least 6 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(150, 'At least 150 characters')
    .required('Description is required'),
  images: Yup.array().min(1, 'Minimum one image'),
  location: Yup.string().required('Location is required'),
});

// LONG PRESS TO DELETE IMAGE
