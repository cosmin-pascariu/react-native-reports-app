import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import AppNavigatorScreen from './AppNavigatorScreen';

const RootStack = createStackNavigator();

const RootStackScreen = () => (
  <RootStack.Navigator
    initialRouteName="SplashScreen"
    screenOptions={{headerShown: false}}>
    <RootStack.Screen name="SplashScreen" component={SplashScreen} />
    <RootStack.Screen
      name="AppNavigatorScreen"
      component={AppNavigatorScreen}
    />
    <RootStack.Screen name="SignInScreen" component={SignInScreen} />
    <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
  </RootStack.Navigator>
);

export default RootStackScreen;
