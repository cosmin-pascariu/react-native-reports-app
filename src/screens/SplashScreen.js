import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';

export default function SplashScreen({navigate}) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Logo</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={() => navigate('SignInScreen')} />
        <Button title="Sign Up" onPress={() => navigate('SignUpScreen')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1256ff',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: '50%',
    borderRadiusBottomLeft: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12569a',
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
    height: '50%',
  },
});
