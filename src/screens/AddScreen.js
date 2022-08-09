import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import Textarea from '../components/Textarea';
import ImagePicker from 'react-native-image-crop-picker';

export default function AddScreen() {
  const [image, setImage] = useState(null);

  const takePhoteFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS === 'android' ? image.path : image.uri;
        setImage(imageUri);
      })
      .catch(err => {
        console.log(err);
      })
      .done();
  };

  const takePhotoFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS === 'android' ? image.path : image.uri;
        setImage(imageUri);
      })
      .catch(err => {
        console.log(err);
      })
      .done();
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} placeholder="Insert title" />
        <Text style={styles.label}>Description</Text>
        <Textarea />
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
});
