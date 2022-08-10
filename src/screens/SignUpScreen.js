import {StyleSheet, Text, View, Button, Alert} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>SignUpScreen</Text>
        <Button title="Sign up" onPress={() => console.log('Sign up!')} />
        <Button
          title="Already have an account? Sign In"
          onPress={() => navigation.navigate('SplashScreen')}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0356e8',
  },
});
