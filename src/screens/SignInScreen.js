import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppNavigatorScreen from './AppNavigatorScreen';
import SignUpScreen from './SignUpScreen';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AuthContext} from '../components/context';

export default function SignInScreen() {
  const navigation = useNavigation();
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const {signIn} = React.useContext(AuthContext);

  const handleSignIn = () => {
    if (data.email === '' || data.password === '') {
      Alert.alert('Error', 'Please fill all fields');
    }
    signIn(data.email, data.password);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome!</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.row}>
            <Ionicons name="mail" size={24} color="#323232" />
            <TextInput
              style={styles.emailInput}
              placeholder="Your E-mail"
              value={data.email}
              onChangeText={text => setData({...data, email: text})}
            />
          </View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.row}>
            <Ionicons name="lock-closed" size={24} color="#323232" />
            <TextInput
              style={styles.emailInput}
              placeholder="Your Password"
              secureTextEntry={!passwordVisibility}
              value={data.password}
              onChangeText={text => setData({...data, password: text})}
            />
            <Ionicons
              name={passwordVisibility ? 'eye' : 'eye-off'}
              size={24}
              color="#323232"
              onPress={() => setPasswordVisibility(!passwordVisibility)}
            />
          </View>
          <Text style={styles.forgotPass}>Forgot password?</Text>

          <Pressable
            style={styles.signInButton}
            onPress={() => navigation.navigate('AppNavigatorScreen')}>
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
          <Pressable
            style={styles.signUpButton}
            onPress={() => {
              signIn();
            }}>
            <Text style={styles.buttonTextBlue}>Sign Up</Text>
          </Pressable>
          {/* Sign in with Google */}
          {/* <Pressable
            style={styles.googleButton}
            onPress={() => console.log('Sign in with Google!')}>
            <Ionicons
              name="logo-google"
              size={24}
              color="#fff"
              style={styles.googleLogo}
            />
            <Text style={styles.buttonText}>Sign In with Google</Text>
          </Pressable> */}
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
    color: '#0356e8',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginBottom: 50,
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
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#0356e8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    width: '100%',
    height: 50,
  },
  googleLogo: {
    position: 'absolute',
    left: 20,
  },
});
