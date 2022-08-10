import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

export default function SplashScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>Stay connected with everyone!</Text>
            <Text style={styles.message}>Sign in with account</Text>
            <Pressable
              onPress={() => navigation.navigate('SignInScreen')}
              style={styles.button}>
              <Text style={styles.buttonText}>Get Started ></Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0356e8',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '60%',
    width: '100%',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#fff',
    height: '40%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  logoCircle: {
    width: '75%',
    height: '67%',
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 150,
    backgroundColor: '#fff',
  },
  logo: {
    width: '95%',
    height: '95%',
    borderRadius: 150,
    borderWidth: 6,
    borderColor: '#323232',
  },
  content: {
    width: '80%',
    height: '80%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#323232',
    textAlign: 'left',
  },
  message: {
    fontSize: 13,
    color: '#777',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  button: {
    width: 140,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0356e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: 'auto',
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
