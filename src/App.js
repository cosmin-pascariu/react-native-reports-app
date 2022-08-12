import 'react-native-gesture-handler';
import * as React from 'react';
import {useState, useEffect, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from './components/context';
import {
  Image,
  // Text,
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
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import DrawerContent from './screens/DrawerContent';
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
import Ionicons from 'react-native-vector-icons/Ionicons';

const RootDrawer = createDrawerNavigator();

function Feed({navigation}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Feed Screen</Text>
      <Button title="Open drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
}

function CustomDrawerContent(props) {
  const {signOut} = React.useContext(AuthContext);

  return (
    <View style={styles.customContainer}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <Text>Sign out</Text>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="Sign out"
            onPress={() => signOut()}
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
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          isLoading: false,
          userToken: action.token,
        };
      case 'LOGIN':
        return {
          ...prevState,
          isLoading: false,
          userName: action.id,
          userToken: action.token,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          isLoading: false,
          userName: null,
          userToken: null,
        };
      case 'REGISTER':
        return {
          ...prevState,
          isLoading: false,
          userName: action.id,
          userToken: action.token,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const authContext = useMemo(
    () => ({
      signIn: (userName, password) => {
        let userToken;
        userToken = null;
        if (userName == 'user' && password == 'password') {
          userToken = 'abc123';
        }
        dispatch({type: 'LOGIN', id: userName, token: userToken});
      },
      signOut: () => {
        dispatch({type: 'LOGOUT'});
      },
      signUp: () => {
        // setUserToken('userToken');
        // setIsLoading(false);
      },
    }),
    [],
  );

  useEffect(() => {
    setTimeout(() => {
      let userToken;
      userToken = 'fgg';

      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
    }, 1000);
  }, []);

  if (loginState.isLoading) {
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
          {loginState.userToken !== null ? (
            <RootDrawer.Navigator
              useLegacyImplementation={false}
              screenOptions={{
                headerShown: false,
              }}
              drawerContent={props => <CustomDrawerContent {...props} />}>
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
