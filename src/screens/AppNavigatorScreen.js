import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Text, View, StyleSheet, Button, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AddScreen from './AddScreen';
import FavouritesScreen from './FavouritesScreen';
import MyPostsScreen from './MyPostsScreen';
import SplashScreen from './SplashScreen';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import firestore from '@react-native-firebase/firestore';

import {AuthContext} from '../components/context';

const Tab = createBottomTabNavigator();

export default function AppNavigatorScreen({navigation}) {
  const [numberOfFav, setNumberOfFav] = useState(null);

  const {signOut} = React.useContext(AuthContext);

  useEffect(() => {
    firestore()
      .collection('posts')
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push(doc.data());
        });
        setNumberOfFav(docs.length);
      });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Favourites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'duplicate' : 'duplicate-outline';
          } else if (route.name === 'MyPosts') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerTitle: props => (
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{route.name}</Text>
            <Image
              source={require('../assets/images.jpeg')}
              style={styles.headerProfile}
              onPress={() => navigation.openDrawer()}
            />
          </View>
        ),
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarBadgeStyle: {backgroundColor: 'red'},
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{tabBarBadge: numberOfFav}}
      />
      <Tab.Screen name="MyPosts" component={MyPostsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#303030',
    fontWeight: 'bold',
  },
  headerProfile: {
    height: 35,
    width: 35,
    borderRadius: 50,
  },
});
