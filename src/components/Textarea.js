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

const Textarea = ({textareaValue, onchangetext, onblur}) => {
  return (
    <View>
      <CustomTextInput
        style={styles.textarea}
        placeholder="Write a short description of what happen..."
        color="#323232"
        placeholderTextColor="#999"
        multiline={true}
        numberOfLines={8}
        maxLength={500}
        editable
        value={textareaValue}
        onChangeText={onchangetext}
        onBlur={onblur}
      />
    </View>
  );
};

export default Textarea;

const styles = StyleSheet.create({
  textarea: {
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    textDecoration: 'none',
    borderRadius: 8,
    marginHorizontal: 2,
    textAlignVertical: 'top',
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
});
