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
} from 'react-native';
import React, {useState} from 'react';
import Textarea from '../components/Textarea';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default function AddScreen() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const takePhoteFromCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS === 'android' ? image.path : image.uri;
        setImages(...images, imageUri);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const takeMultiplePhotos = () => {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      mediaType: 'photo',
      compressImageMaxWidth: 640,
      compressImageMaxHeight: 480,
      compressImageQuality: 0.5,
      compressVideoPreset: 'MediumQuality',
      cropping: true,
      cropperChooseText: 'Choose',
      cropperCancelText: 'Cancel',
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
      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const extention = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
      filename = name + Date.now() + '.' + extention;
      const uploadTask = storage().ref(filename).putFile(uploadUri);
      uploadTask.on(
        'state_changed',
        snapshot => {},
        error => {
          console.log(error);
        },
        async () => {
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          setImages(...images, url);
        },
      );
    });
    await Promise.all(promises);
    const post = {
      images: images,
      title: title,
      location: 'Suceava, Romania',
      description: description,
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
        {images.length > 1 && (
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

// const submitPost = async () => {
//   const uploadUri = image;
//   let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

//   const post = {
//     images: images.length > 1 ? images : image,
//     title: title,
//     location: 'Suceava, Romania',
//     description: description,
//   };
//   await firestore().collection('posts').add(post);
//   setImage(null);
//   setImages([]);

//   Alert.alert('Success', 'Post added successfully');
// };

// const submitImage = async () => {
//   const uploadUri = image;
//   let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

//   // Add timestamp to filename
//   const extention = filename.split('.').pop();
//   const name = filename.split('.').slice(0, -1).join('.');
//   filename = name + Date.now() + '.' + extention;

//   setUploading(true);
//   setTransferred(0);

//   const task = storage().ref(filename).putFile(uploadUri);

//   try {
//     await task;

//     // Set transferred state
//     task.on('state_changed', taskSnapshot => {
//       console.log(
//         `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
//       );
//       setTransferred(
//         Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
//           100,
//       );
//     });

//     setUploading(false);
//     Alert.alert(
//       'Image uploaded!',
//       'Your image has been uploaded successfully to the storage',
//     );
//   } catch (e) {
//     Alert.alert(e.message);
//   }

//   setImage(null);
// };
