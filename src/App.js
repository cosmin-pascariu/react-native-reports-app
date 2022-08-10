import * as React from 'react';
import {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {Image, Text, View, StyleSheet, Button, TextInput} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AppNavigatorScreen from './screens/AppNavigatorScreen';
import RootStackScreen from './screens/RootStackScreen';

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStackScreen />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
export default App;
