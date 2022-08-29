import 'react-native-gesture-handler';
import * as React from 'react';
import {useState, useEffect, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from './components/context';
import {
  Image,
  View,
  StyleSheet,
  Button,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  Pressable,
} from 'react-native-safe-area-context';
import AppNavigatorScreen from './screens/AppNavigatorScreen';
import RootStackScreen from './screens/RootStackScreen';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import {authContext} from './components/context';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth, {getAuth, updateProfile} from '@react-native-firebase/auth';
import MyProfileScreen from './screens/MyProfileScreen';

const RootDrawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const userSignOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  return (
    <View style={styles.customContainer}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="My profile"
            icon={({color, size}) => (
              <Ionicons name="person-circle" color={color} size={size} />
            )}
          />
        </Drawer.Section>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="Another action"
            icon={({color, size}) => (
              <Ionicons name="exit" color={color} size={size} />
            )}
          />
        </Drawer.Section>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="Another action"
            icon={({color, size}) => (
              <Ionicons name="exit" color={color} size={size} />
            )}
          />
        </Drawer.Section>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="Another action"
            icon={({color, size}) => (
              <Ionicons name="exit" color={color} size={size} />
            )}
          />
        </Drawer.Section>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="Sign out"
            onPress={() => userSignOut()}
            icon={({color, size}) => (
              <Ionicons name="exit" color={color} size={size} />
            )}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
    </View>
  );
}

function App() {
  const [initialising, setInitialising] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initialising) setInitialising(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <SafeAreaProvider>
        <NavigationContainer>
          {user ? (
            <RootDrawer.Navigator
              // useLegacyImplementation
              screenOptions={{
                headerShown: false,
                swipeEdgeWidth: 0,
                drawerLockMode: 'locked-open',
              }}
              // drawerContent={props => <CustomDrawerContent {...props} />}
            >
              <RootDrawer.Screen
                name="AppNavigatorScreen"
                component={AppNavigatorScreen}
                options={{
                  drawerItemStyle: {height: 0},
                }}
              />
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
