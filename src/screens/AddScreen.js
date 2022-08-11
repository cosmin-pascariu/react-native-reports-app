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
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import Textarea from '../components/Textarea';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function AddScreen() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const takePhoteFromCamera = () => {
    ImagePicker.openCamera({
      width: WIDTH,
      height: HEIGHT / 2 - 20,
      cropping: true,
    })
      .then(image => {
        // console.log(image);
        // const imageUri = Platform.OS === 'android' ? image.path : image.uri;
        setImages(...images, image);
        // console.log(images);
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
        console.log(images);
        setImages(images);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const submitImages = async () => {
    const promises = images.map(async image => {
      const uploadUri = image.path;
      const uploadTask = storage().ref(uploadUri).putFile(uploadUri);
      uploadTask.on(
        'state_changed',
        snapshot => {},
        error => {
          console.log(error);
        },
        async () => {
          const url = await uploadTask.snapshot.ref.getDownloadURL();
        },
      );
    });
    await Promise.all(promises);
    const post = {
      images: images,
      title: title,
      location: 'Suceava, Romania',
      description: description,
      bookmark: false,
    };
    await firestore().collection('posts').add(post);
    setImages([]);
    Alert.alert('Success', 'Post added successfully');
  };

  const getImagesFromStorage = async () => {
    // const images = await storage()
    //   .ref('b6ae607d-cc17-4ec4-82f7-e86a3e7542081660125496517.jpg')
    //   .getDownloadURL();
    // setImage(image);
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
            onPress={takePhoteFromCamera}
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
            {images.map(image => (
              <Image
                key={image.path}
                source={{uri: image.path}}
                style={styles.loadedImage}
                resizeMode="contain"
              />
            ))}
          </View>
        )}
        <Button title="Submit" onPress={submitImages} />
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
});
