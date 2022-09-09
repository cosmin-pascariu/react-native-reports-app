import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import React from 'react';

export default function PdfButton({onpress, text}) {
  return (
    <TouchableWithoutFeedback onPress={onpress}>
      <View style={styles.pdfButton}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  pdfButton: {
    width: '98%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 40,
    borderRadius: 12,
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
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#323232',
    fontWeight: 'bold',
  },
});
