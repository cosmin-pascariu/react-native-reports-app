import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import SignInScreen from './SignInScreen';
import SplashScreen from './SplashScreen';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);

  const [userData, setUserData] = useState({
    email: '',
    password: '',
    profileImage: '',
    fullName: 'anonim',
    posts: [],
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordValidation = () => {
    if (userData.password !== confirmPassword) {
      return false;
    }
    return true;
  };

  const addNewUser = () => {
    firestore()
      .collection('users')
      .add({
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        profileImage: userData.profileImage,
        posts: userData.posts,
      })
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });
  };

  const createUser = (email, password) => {
    if (email === '' || password === '' || confirmPassword === '') {
      Alert.alert('Please fill all the fields');
    } else if (passwordValidation()) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!');
          addNewUser();
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
    } else {
      Alert.alert('Passwords do not match');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Register Now!</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.row}>
            <Ionicons name="mail" size={24} color="#323232" />
            <TextInput
              style={styles.emailInput}
              placeholder="Your E-mail"
              value={userData.email}
              onChangeText={text => setUserData({...userData, email: text})}
            />
          </View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.row}>
            <Ionicons name="lock-closed" size={24} color="#323232" />
            <TextInput
              style={styles.emailInput}
              placeholder="Your Password"
              secureTextEntry={!passwordVisibility}
              value={userData.password}
              onChangeText={text => setUserData({...userData, password: text})}
            />
            <Ionicons
              name={passwordVisibility ? 'eye' : 'eye-off'}
              size={24}
              color="#323232"
              onPress={() => setPasswordVisibility(!passwordVisibility)}
            />
          </View>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.row}>
            <Ionicons name="lock-closed" size={24} color="#323232" />
            <TextInput
              style={styles.emailInput}
              placeholder="Confirm Your Password"
              secureTextEntry={!confirmPasswordVisibility}
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
            />
            <Ionicons
              name={confirmPasswordVisibility ? 'eye' : 'eye-off'}
              size={24}
              color="#323232"
              onPress={() =>
                setConfirmPasswordVisibility(!confirmPasswordVisibility)
              }
            />
          </View>
          <Text style={styles.forgotPass}>
            By singing up you agree to our{' '}
            <Text style={styles.boldText}>Terms of service</Text> and{' '}
            <Text style={styles.boldText}>Privacy policy</Text>
          </Text>

          <Pressable
            style={styles.signInButton}
            onPress={() => createUser(userData.email, userData.password)}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
          <Pressable
            style={styles.signUpButton}
            // onPress={() => navigation.navigate('SignInScreen')}>
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonTextBlue}>Sign In</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0356e8',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 40,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 'auto',
  },
  header: {
    height: '25%',
  },
  formContainer: {
    height: '75%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#323232',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  emailInput: {
    flex: 1,
    height: 30,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderColor: '#999',
    paddingBottom: 0,
    paddingTop: 0,
    textDecoration: 'none',
  },
  forgotPass: {
    fontSize: 14,
    color: '#999',
    textDecoration: 'none',
    // fontWeight: 'bold',
    marginBottom: 50,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
  },
  signInButton: {
    backgroundColor: '#0356e8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    height: 50,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  buttonTextBlue: {
    fontSize: 16,
    color: '#0356e8',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderColor: '#0356e8',
    borderWidth: 2,
    width: '100%',
    height: 50,
  },
});
