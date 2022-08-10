import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import AppNavigatorScreen from './AppNavigatorScreen';
import SplashScreen from './SplashScreen';

export default function SignInScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>SignInScreen</Text>
      <Button
        title="Sign In"
        onPress={() => navigation.navigate('AppNavigatorScreen')}
      />
      <Button
        title="Go Back To SplashScreen"
        onPress={() => navigation.navigate('SplashScreen')}
      />
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
});
