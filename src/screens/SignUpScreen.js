import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import SignInScreen from './SignInScreen';
import SplashScreen from './SplashScreen';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Formik, useFormik} from 'formik';
import * as yup from 'yup';

export default function SignUpScreen() {
  const navigation = useNavigation();

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);

  const userData = {
    email: '',
    password: '',
    confirmPassword: '',
    profileImage:
      'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    fullName: 'anonim',
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 6 characters'),
    fullName: yup.string().required('Full name is required'),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .test('passwords-match', 'Passwords must match', function (value) {
        return this.parent.password === value;
      }),
  });

  const addNewUser = data => {
    firestore()
      .collection('users')
      .add({
        uid: auth().currentUser.uid,
        name: data.fullName,
        email: data.email,
        password: data.password,
        profileImage: data.profileImage,
      })
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });
  };

  const createUser = data => {
    if (
      data.email === '' ||
      data.password === '' ||
      data.confirmPassword === ''
    ) {
      Alert.alert('Please fill all the fields');
    } else {
      auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then(() => {
          Alert.alert('User account created & signed in!');
          addNewUser(data);
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            Alert.alert('That email address is invalid!');
          }

          console.error(error);
        });
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Register Now!</Text>
        </View>
        <Formik
          initialValues={userData}
          validationSchema={validationSchema}
          onSubmit={values => {
            createUser(values);
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => {
            const {email, password, confirmPassword, profileImage, fullName} =
              values;

            return (
              <ScrollView style={styles.formContainer}>
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
                    color="#323232"
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
                    color="#323232"
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
                <View style={styles.rowLabel}>
                  <Text style={styles.label}>Confirm Password</Text>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorMessage}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>
                <View style={styles.row}>
                  <Ionicons name="lock-closed" size={24} color="#323232" />
                  <TextInput
                    style={styles.emailInput}
                    placeholder="Confirm Your Password"
                    color="#323232"
                    placeholderTextColor="#999"
                    secureTextEntry={!confirmPasswordVisibility}
                    value={confirmPassword}
                    onBlur={handleBlur('confirmPassword')}
                    onChangeText={handleChange('confirmPassword')}
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
                  By singing up you agree to our
                  <Text style={styles.boldText}>Terms of service</Text> and
                  <Text style={styles.boldText}>Privacy policy</Text>
                </Text>

                <Pressable style={styles.signInButton} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>
                <Pressable
                  style={styles.signUpButton}
                  onPress={() => navigation.goBack()}>
                  <Text style={styles.buttonTextBlue}>Sign In</Text>
                </Pressable>
              </ScrollView>
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
  errorMessage: {
    color: '#ff0000',
  },
  rowLabel: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
