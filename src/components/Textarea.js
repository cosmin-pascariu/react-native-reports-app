/* eslint-disable react-native/no-inline-styles */
import {TextInput, View, StyleSheet} from 'react-native';
import React from 'react';

const CustomTextInput = props => {
  return (
    <TextInput
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable
      maxLength={40}
    />
  );
};

const Textarea = () => {
  const [value, onChangeText] = React.useState('');

  return (
    <View>
      <CustomTextInput
        multiline={true}
        numberOfLines={8}
        onChangeText={text => onChangeText(text)}
        value={value}
        style={styles.textarea}
        placeholder="Write a short description of what happen..."
        maxLength={500}
        editable
      />
    </View>
  );
};

export default Textarea;

const styles = StyleSheet.create({
  textarea: {
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    textDecoration: 'none',
    borderRadius: 8,
    textAlignVertical: 'top',
  },
});
