import 'react-native-gesture-handler';
import * as React from 'react';
import {useState, useEffect, useMemo, useRoute} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from './components/context';
import {
  Image,
  View,
  StyleSheet,
  Button,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  Pressable,
} from 'react-native-safe-area-context';
import AppNavigatorScreen from './screens/AppNavigatorScreen';
import RootStackScreen from './screens/RootStackScreen';
// import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {authContext} from './components/context';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth, {getAuth, updateProfile} from '@react-native-firebase/auth';
import MyProfileScreen from './screens/MyProfileScreen';
import firestore from '@react-native-firebase/firestore';

// const RootDrawer = createDrawerNavigator();
const RootDrawer = createStackNavigator();

function App() {
  const [initialising, setInitialising] = useState(true);
  const [user, setUser] = useState();
  const [userData, setUserData] = useState(null);
  const [onSetupProfile, setOnSetupProfile] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initialising) setInitialising(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // console.log(auth().currentUser.displayName);
  return (
    <AuthContext.Provider value={authContext}>
      <SafeAreaProvider
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <NavigationContainer>
          {user ? (
            <RootDrawer.Navigator
              initialRouteName="SetupProfileScreen"
              screenOptions={{
                headerShown: false,
                swipeEdgeWidth: 0,
                drawerLockMode: 'locked-open',
              }}>
              {user._user?.displayName?.length > 0 ? (
                <RootDrawer.Screen
                  name="AppNavigatorScreen"
                  component={AppNavigatorScreen}
                  options={{}}
                />
              ) : (
                <RootDrawer.Screen
                  name="SetupProfileScreen"
                  component={MyProfileScreen}
                  options={{}}
                />
              )}
            </RootDrawer.Navigator>
          ) : (
            <RootStackScreen />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customContainer: {
    flex: 2,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
});

// {user ? (
//   <RootDrawer.Navigator
//     screenOptions={{
//       headerShown: false,
//       swipeEdgeWidth: 0,
//       drawerLockMode: 'locked-open',
//     }}>
//     {userData?.name.length > 0 && userData?.location.length > 0 ? (
//       <RootDrawer.Screen
//         name="AppNavigatorScreen"
//         component={AppNavigatorScreen}
//         options={{
//           drawerItemStyle: {height: 0},
//         }}
//       />
//     ) : (
//       <RootDrawer.Screen
//         name="SetupProfileScreen"
//         component={MyProfileScreen}
//         options={{
//           drawerItemStyle: {height: 0},
//         }}
//       />
//     )}
//   </RootDrawer.Navigator>
// ) : (
//   <RootStackScreen />
// )}
