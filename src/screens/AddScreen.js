import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  Button,
  Image,
  View,
  Alert,
  Dimensions,
  Platform,
  PermissionsAndroid,
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

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function AddScreen() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    getMyLocation();
  }),
    [];

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
    let datas = {
      key: markers.length,
      coords: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
      pinColor: '#f00',
      title: 'Problem Location',
      description: 'The problem is here',
    };
    setRegion({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    setLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
    setMarkers([datas]);
  }

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: WIDTH,
      height: HEIGHT / 2 - 20,
      cropping: true,
    })
      .then(image => {
        // console.log(image);
        // const imageUri = Platform.OS === 'ios' ? image.uri : image.path;
        // let filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
        // const extension = filename.split('.').pop();
        // const name = filename.split('.').slice(0, -1).join('.');
        // filename = name + Date.now() + '.' + extension;

        // setImage(filename);
        setImages([image]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const takeMultiplePhotos = () => {
    ImagePicker.openPicker({
      multiple: true,
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
      postUserName: auth().currentUser.uid,
      postUserProfilePicture: auth().currentUser.photoURL,
      images: imagesPath,
      title: title,
      location: location,
      description: description,
      bookmark: false,
      important: 0,
      good: 0,
      bad: 0,
      createdAt: new Date(),
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
    console.log('Images::', images);
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
          <Ionicons
            name="ios-camera"
            size={30}
            color="black"
            onPress={takePhotoFromCamera}
          />
          <Ionicons
            name="ios-images"
            size={30}
            color="black"
            onPress={takeMultiplePhotos}
          />
        </View>
        {images.length > 0 && (
          <View style={styles.loadedImages}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{uri: image.path}}
                style={styles.loadedImage}
                resizeMode="contain"
              />
            ))}
          </View>
        )}

        <MapView
          onMapReady={() => {
            Platform.OS !== 'ios'
              ? PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ).then(granted => {
                  console.log('Granted:', granted);
                })
              : null;
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
        <Button title="Submit" onPress={submitImages} />
        <Button title="Console" onPress={() => showConsole()} />
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
    borderWidth: 1,
    padding: 10,
    textDecoration: 'none',
    borderRadius: 8,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  loadedImages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 20,
  },
  loadedImage: {
    width: '45%',
    height: 200,
    marginBottom: 10,
    marginRight: 10,
    objectFit: 'cover',
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
});
