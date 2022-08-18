import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';

export default function SearchScreen({navigation}) {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const [deletedUser, setDeletedUser] = useState('');
  const [deletedUserId, setDeletedUserId] = useState('');
  const [updatedUser, setUpdatedUser] = useState('');

  useEffect(() => {
    firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push(doc.data());
        });
        console.log(docs);
        setUsers(docs);
      });
  }, []);

  const addNewUser = () => {
    console.log('Email', auth.currentUser);
    firestore()
      .collection('users')
      .add({
        name: userName,
      })
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });
  };

  const deleteUser = id => {
    firestore()
      .collection('users')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch(error => {
        console.error('Error removing document: ', error);
      });
  };

  const getUserId = firestore()
    .collection('users')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.data().name === deletedUser ? setDeletedUserId(doc.id) : false;
      });
    });

  const updateUser = id => {
    firesotre()
      .collection('users')
      .doc(id)
      .update({name: updatedUser})
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch(error => {
        console.error('Error updateing document: ', error);
      });
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {users.map(user => (
        <Text key={uuid.v4()}>FullName: {user.name} </Text>
      ))}
      <Button
        title="Show user data in console"
        onPress={() => console.log(users)}
      />
      <TextInput
        placeholder="Enter name"
        value={userName}
        onChangeText={text => setUserName(text)}
      />
      <Button
        title="Add user"
        onPress={userName !== '' ? () => addNewUser() : console.log('No name')}
      />
      <TextInput
        placeholder="Enter name"
        value={deletedUser}
        onChangeText={text => setDeletedUser(text)}
      />
      <Button
        title="Delete user"
        onPress={
          deletedUser !== ''
            ? () => deleteUser(deletedUserId)
            : console.log('No name')
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
