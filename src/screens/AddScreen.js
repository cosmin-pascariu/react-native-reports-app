import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import Textarea from '../components/Textarea';

export default function AddScreen() {
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} placeholder="Insert title" />
        <Text style={styles.label}>Description</Text>
        {/* <TextInput
          style={styles.textarea}
          placeholder="Write a short description of what happen..."
          multiline={true}
          numberOfLines={8}
          maxLength={500}
          editable
        /> */}
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
