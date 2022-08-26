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
  TouchableOpacity,
  Pressable,
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
import {Formik} from 'formik';
import * as yup from 'yup';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

Geocoder.init('AIzaSyAj_B3UnNBrTZE9i_wHuVgnXZ74HQgExHQ');

export default function AddScreen({route, navigation}) {
  // is focused is used to check if the screen is focused or not
  const isFocused = useIsFocused();
  const [modalVisibility, setModalVisibility] = useState(true);

  const checkIsFocused = () => {
    if (isFocused) {
      console.log('focused');
    } else {
      console.log('not focused');
      setModalVisibility(true);
    }
  };

  // const navigation = useNavigation();
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentPostId, setCurrentPostId] = useState([]);

  const [images, setImages] = useState([]);
  const [titleValidation, setTitleValidation] = useState(false);
  const [descriptionValidation, setDescriptionValidation] = useState(false);
  const [imagesValidation, setImagesValidation] = useState(false);
  const [locationValidation, setLocationValidation] = useState(false);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagesFromStorage, setImagesFromStorage] = useState([]);

  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);

  // const postData = {
  //   title: title,
  //   description: description,
  // };
  const getImageFromStorage = async receivedImages => {
    const imagesStorage = [];
    for (let i = 0; i < receivedImages.length; i++) {
      const image = await storage().ref(receivedImages[i]).getDownloadURL();
      imagesStorage.push(image);
      console.log('image', image);
    }
    setImagesFromStorage(imagesStorage);
  };

  useEffect(() => {
    checkIsFocused();
    getMyLocation();
    if (route?.params?.edit) {
      autocompleteFields();
    }
  }, [route?.params?.edit, isFocused]);

  const autocompleteFields = () => {
    if (route?.params?.edit) {
      firestore()
        .collection('posts')
        .doc(route.params.postId)
        .get()
        .then(doc => {
          setTitle(doc.data().title);
          setLocation(doc.data().location);
          setDescription(doc.data().description);
          // getImageFromStorage(doc.data().images));
          // console.log('images', images);
          setImages(doc.data().images);
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
        setLocation(address);
        console.log('address', address);
      })
      .catch(error => console.warn(error));
  }

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: WIDTH,
      height: HEIGHT / 2 - 20,
      cropping: true,
    })
      .then(image => {
        setImages([...images, image]);
        console.log('Images', images);
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
        images.map(image => {
          setImages(images);
        });
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
    };

    await firestore().collection('posts').add(post);
    Alert.alert('Success', 'Post added successfully');
    setImages([]);
    setTitle('');
    setLocation('');
    setDescription('');
    setMarkers([]);
  };

  const editPost = async () => {
    const updatedPost = {
      // images: images,
      title: title,
      location: location,
      coordinates: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      description: description,
    };
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

  const checkData = () => {
    if (!title) {
      setTitleValidation(true);
    } else if (!description) {
      setTitleValidation(false);
      setDescriptionValidation(true);
    } else if (images.length < 1) {
      setDescriptionValidation(false);
      setImagesValidation(true);
    } else if (!location) {
      setImagesValidation(false);
      setLocationValidation(true);
    } else {
      setLocationValidation(false);
    }
  };

  function submitData() {
    if (title && description && images.length > 0 && location) {
      if (route?.params?.edit) {
        return editPost();
      } else {
        return submitPost();
      }
    }
    checkData();
  }

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.rowLabel}>
          <Text style={styles.label}>Title</Text>
          {titleValidation && (
            <Text style={styles.errorMessage}>Title is required</Text>
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Insert title"
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <View style={styles.rowLabel}>
          <Text style={styles.label}>Description</Text>
          {descriptionValidation && (
            <Text style={styles.errorMessage}>Description is required</Text>
          )}
        </View>
        <Textarea
          textareaValue={description}
          setTextareaValue={setDescription}
        />
        <View style={styles.rowLabel}>
          <Text
            style={styles.label}
            onPress={() => {
              getImageFromStorage(images);
              console.log('images:', images);
            }}>
            Media
          </Text>
          {imagesValidation && (
            <Text style={styles.errorMessage}>
              At least on image is required
            </Text>
          )}
        </View>
        <View style={styles.mediaButtons}>
          <TouchableOpacity onPress={takePhotoFromCamera}>
            <View style={styles.customImgButton}>
              <Image
                source={require('../assets/camera.png')}
                style={styles.customImgBackground}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={takeMultiplePhotos}>
            <View style={styles.customImgButton}>
              <Image
                source={require('../assets/gallery.png')}
                style={styles.customImgBackground}
              />
            </View>
          </TouchableOpacity>
        </View>
        {images.length > 0 && (
          <View style={styles.loadedImages}>
            {imagesFromStorage
              ? imagesFromStorage.map((image, index) => (
                  <Image
                    key={index}
                    source={{uri: image}}
                    style={styles.loadedImage}
                  />
                ))
              : images.map((image, index) => (
                  <Image
                    key={index}
                    source={{uri: image.path}}
                    style={styles.loadedImage}
                  />
                ))}
          </View>
        )}
        <View style={styles.rowLabel}>
          <Text style={styles.label}>Location</Text>
          {locationValidation && (
            <Text style={styles.errorMessage}>Location is required</Text>
          )}
        </View>
        <MapView
          onMapReady={() => {
            Platform.OS !== 'ios'
              ? PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ).then(granted => {
                  console.log('Granted:', granted);
                })
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
            />
          ))}
        </MapView>
        <TouchableOpacity onPress={() => submitData()}>
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
});
