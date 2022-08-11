import 'react-native-gesture-handler';
import * as React from 'react';
import {useState, useEffect, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from './components/context';
import {
  Image,
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AppNavigatorScreen from './screens/AppNavigatorScreen';
import RootStackScreen from './screens/RootStackScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import DrawerContent from './screens/DrawerContent';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function Feed({navigation}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Feed Screen</Text>
      <Button title="Open drawer" onPress={() => navigation.openDrawer()} />
      <Button title="Toggle drawer" onPress={() => navigation.toggleDrawer()} />
    </View>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} activeTintColor="#2196f3" />
    </DrawerContentScrollView>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [con, setCon] = useState(true);

  const authContext = useMemo(() => ({
    signIn: () => {
      setUserToken('userToken');
      setIsLoading(false);
      setCon(false);
    },
    signOut: () => {
      setUserToken(null);
      setIsLoading(false);
    },
    signUp: () => {
      setUserToken('userToken');
      setIsLoading(false);
    },
  }));

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <SafeAreaProvider>
        <NavigationContainer>
          {!con ? (
            <Drawer.Navigator
              useLegacyImplementation
              screenOptions={{
                headerShown: false,
              }}
              drawerContent={props => <CustomDrawerContent {...props} />}>
              <Drawer.Screen
                name="AppNavigatorScreen"
                component={AppNavigatorScreen}
              />
              <Drawer.Screen name="Feed" component={Feed} />
            </Drawer.Navigator>
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
});
