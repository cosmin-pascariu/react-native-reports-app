import {
  TouchableWithoutFeedback,
  View,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React from 'react';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function MediaButton({onpress, imageSource}) {
  return (
    <TouchableWithoutFeedback onPress={onpress}>
      <View style={styles.customImgButton}>
        <Image source={imageSource} style={styles.customImgBackground} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
});
