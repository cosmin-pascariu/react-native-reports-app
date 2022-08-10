import {StyleSheet, Text, View, Pressable, TextInput} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AppNavigatorScreen from './AppNavigatorScreen';
import SplashScreen from './SplashScreen';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SignInScreen() {
  const navigation = useNavigation();
  const [passwordVisibility, setPasswordVisibility] = useState(false);

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
            <TextInput style={styles.emailInput} placeholder="Your E-mail" />
          </View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.row}>
            <Ionicons name="lock-closed" size={24} color="#323232" />
            <TextInput
              style={styles.emailInput}
              placeholder="Your Password"
              secureTextEntry={!passwordVisibility}
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
            onPress={() => navigation.navigate('SplashScreen')}>
            <Text style={styles.buttonTextBlue}>Sign Up</Text>
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
    marginBottom: 20,
    width: '100%',
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  buttonTextBlue: {
    fontSize: 18,
    color: '#0356e8',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#0356e8',
    borderWidth: 2,
    width: '100%',
    height: 50,
  },
});
