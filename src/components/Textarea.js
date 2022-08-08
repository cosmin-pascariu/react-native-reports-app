/* eslint-disable react-native/no-inline-styles */
import {TextInput, View, StyleSheet} from 'react-native';
import React from 'react';

const CustomTextInput = props => {
  return (
    <TextInput
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable
    />
  );
};

const Textarea = () => {
  const [value, onChangeText] = React.useState('');

  return (
    <View>
      <CustomTextInput
        style={styles.textarea}
        placeholder="Write a short description of what happen..."
        multiline={true}
        numberOfLines={8}
        maxLength={300}
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
