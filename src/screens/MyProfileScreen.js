import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function MyProfileScreen() {
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [inputVisibility, setInputVisibility] = useState(false);

  useEffect(() => {
    const userId = auth().currentUser.uid;
    firestore()
      .collection('users')
      .where('uid', '==', userId)
      .onSnapshot(doc => {
        doc.forEach(doc => {
          setUserID(doc.id);
          setUserName(doc.data().name);
          setUserEmail(doc.data().email);
          setUserPassword(doc.data().password);
        });
      });
  }, []);

  const updateUser = () => {
    console.log('userIDd', userID);
    firestore()
      .collection('users')
      .doc(userID)
      .update({
        name: userName,
        email: userEmail,
        password: userPassword,
      })
      .then(() => {
        setInputVisibility(false);
      })
      .catch(error => {
        console.error('Error updating document: ', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/camera.png')}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="md-create" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{userName}</Text>
      </View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Insert your name"
        value={userName}
        onChangeText={text => setUserName(text)}
        editable={inputVisibility}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Insert your email"
        value={userEmail}
        onChangeText={text => setUserEmail(text)}
        editable={inputVisibility}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Insert your password"
        value={userPassword}
        onChangeText={text => setUserPassword(text)}
        editable={inputVisibility}
        secureTextEntry={true}
      />
      <View style={styles.buttonContainer}>
        {inputVisibility ? (
          <Pressable style={styles.button}>
            <Text style={styles.buttonText} onPress={() => updateUser()}>
              Save
            </Text>
          </Pressable>
        ) : (
          <Pressable style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={() => setInputVisibility(true)}>
              Edit Fields
            </Text>
          </Pressable>
        )}
        <Pressable
          style={styles.cancelButton}
          onPress={() => setInputVisibility(false)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,

    marginLeft: 'auto',
    marginRight: 'auto',
  },
  profileImage: {
    resizeMode: 'cover',
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 100,
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
    padding: 10,
    marginHorizontal: 2,
    textDecoration: 'none',
    borderRadius: 8,
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
  editButton: {
    position: 'absolute',
    right: 0,
    top: 150,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
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
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 18,
    color: '#303030',
    textDecoration: 'none',

    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    height: 40,
    width: '45%',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#0356e8',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 20,
    height: 40,
    width: '50%',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#f00',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});
