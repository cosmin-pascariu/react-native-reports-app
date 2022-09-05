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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Formik, useFormik} from 'formik';
import * as yup from 'yup';

export default function SignInScreen() {
  const navigation = useNavigation();
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const userData = {
    email: '',
    password: '',
    profileImage: '',
    fullName: '',
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
  });

  const userSignIn = (email, password) => {
    if (email === '' || password === '') {
      Alert.alert('Please fill all the fields');
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/wrong-password') {
            Alert.alert('Wrong password.');
          }
          if (error.code === 'auth/user-not-found') {
            Alert.alert('User not found.');
          }
          if (error.code === 'auth/invalid-email') {
            Alert.alert('That email address is invalid!');
          }
        });
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome!</Text>
        </View>
        <Formik
          initialValues={userData}
          validationSchema={validationSchema}
          onSubmit={values => {
            userSignIn(values.email, values.password);
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => {
            const {email, password, fullName} = values;

            return (
              <View style={styles.formContainer}>
                <View style={styles.rowLabel}>
                  <Text style={styles.label}>E-mail</Text>
                  {touched.email && errors.email && (
                    <Text style={styles.errorMessage}>{errors.email}</Text>
                  )}
                </View>
                <View style={styles.row}>
                  <Ionicons name="mail" size={24} color="#323232" />
                  <TextInput
                    style={styles.emailInput}
                    placeholder="Your E-mail"
                    placeholderTextColor="#999"
                    value={email}
                    onBlur={handleBlur('email')}
                    onChangeText={handleChange('email')}
                  />
                </View>

                <View style={styles.rowLabel}>
                  <Text style={styles.label}>Password</Text>
                  {touched.password && errors.password && (
                    <Text style={styles.errorMessage}>{errors.password}</Text>
                  )}
                </View>
                <View style={styles.row}>
                  <Ionicons name="lock-closed" size={24} color="#323232" />
                  <TextInput
                    style={styles.emailInput}
                    placeholder="Your Password"
                    placeholderTextColor="#999"
                    secureTextEntry={!passwordVisibility}
                    value={password}
                    onBlur={handleBlur('password')}
                    onChangeText={handleChange('password')}
                  />
                  <Ionicons
                    name={passwordVisibility ? 'eye' : 'eye-off'}
                    size={24}
                    color="#323232"
                    onPress={() => setPasswordVisibility(!passwordVisibility)}
                  />
                </View>
                <Pressable style={styles.signInButton} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Sign In</Text>
                </Pressable>
                <Pressable
                  style={styles.signUpButton}
                  onPress={() => navigation.navigate('SignUpScreen')}>
                  <Text style={styles.buttonTextBlue}>Sign Up</Text>
                </Pressable>
              </View>
            );
          }}
        </Formik>
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
    color: '#323232',
    placeholderTextColor: '#323232',
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderColor: '#999',
    paddingBottom: 0,
    paddingTop: 0,
    textDecoration: 'none',
  },
  signInButton: {
    backgroundColor: '#0356e8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 105,
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
  errorMessage: {
    color: '#ff0000',
  },
  rowLabel: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
