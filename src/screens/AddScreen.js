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
  PermissionsAndroid,
  TouchableOpacity,
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
import {useNavigation} from '@react-navigation/native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

Geocoder.init('AIzaSyAj_B3UnNBrTZE9i_wHuVgnXZ74HQgExHQ');

export default function AddScreen({route}) {
  const navigation = useNavigation();
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentPostId, setCurrentPostId] = useState([]);
  const [postUserName, setPostUserName] = useState('');

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    getMyLocation();
  }, []);

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

  const submitImages = async () => {
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
      important: 0,
      good: 0,
      bad: 0,
      createdAt: new Date(),
      usersList: [],
    };

    await firestore().collection('posts').add(post);
    Alert.alert('Success', 'Post added successfully');
    setImages([]);
    setTitle('');
    setLocation('');
    setDescription('');
    setMarkers([]);
  };

  const showConsole = () => {
    route.params.postId ? console.log('Route', route.params.postId) : '';
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Insert title"
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <Text style={styles.label}>Description</Text>
        <Textarea
          textareaValue={description}
          setTextareaValue={setDescription}
        />
        <Text style={styles.label}>Images & Video</Text>
        <View style={styles.mediaButtons}>
          <TouchableOpacity onPress={takePhotoFromCamera}>
            <View style={styles.customImgButton}>
              {/* <Ionicons name="ios-camera" size={30} color="black" /> */}
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
            {images.map((image, index) => (
              <Image
                key={index}
                source={{uri: image.path}}
                style={styles.loadedImage}
              />
            ))}
          </View>
        )}
        <Text style={styles.label}>Location</Text>
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
        <TouchableOpacity onPress={submitImages}>
          <View style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </View>
        </TouchableOpacity>
        <Button
          title="Console"
          onPress={() => showConsole()}
          style={styles.submitButton}
        />
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
});
