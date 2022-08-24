import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Image,
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AddScreen from './AddScreen';
import FavouritesScreen from './FavouritesScreen';
import MyPostsScreen from './MyPostsScreen';
import SplashScreen from './SplashScreen';
import HomeScreen from './HomeScreen';
import MyProfileScreen from './MyProfileScreen';
import CommentsScreen from './CommentsScreen';
import SearchScreen from './SearchScreen';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../components/context';
import {HeaderBackButton} from '@react-navigation/stack';

const Tab = createBottomTabNavigator();

export default function AppNavigatorScreen({navigation}) {
  const [numberOfFav, setNumberOfFav] = useState(null);

  useEffect(() => {
    firestore()
      .collection('posts')
      .where('usersList', 'array-contains', auth().currentUser.uid)
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push(doc.data());
        });
        setNumberOfFav(docs.length);
      });
    updateProfileData();
  }, []);

  const updateProfileData = async () => {
    const user = auth().currentUser;
    const userUpdate = {
      displayName: 'Anonim',
      photoURL:
        auth().currentUser.photoURL ||
        'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    };
    await user.updateProfile(userUpdate);
  };

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
            <Text style={styles.headerTitle}>
              {route?.params?.edit ? 'Edit' : route.name}
            </Text>
            <Pressable onPress={() => navigation.toggleDrawer()}>
              <Image
                source={{
                  uri: auth().currentUser.photoURL || '',
                }}
                style={styles.headerProfile}
              />
            </Pressable>
          </View>
        ),
        headerLeft: props =>
          route?.name === 'Comments' && (
            <View style={styles.headerLeft}>
              <Ionicons
                name="chevron-back-sharp"
                size={24}
                color="black"
                onPress={() => navigation.goBack()}
              />
            </View>
          ),
        tabBarActiveTintColor: '#0356e8',
        tabBarInactiveTintColor: '#999',
        tabBarBadgeStyle: {backgroundColor: 'red'},
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{tabBarBadge: numberOfFav}}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={({route}) => ({
          title: route?.params?.edit ? 'Edit' : 'Add',
        })}
      />
      <Tab.Screen name="MyPosts" component={MyPostsScreen} />
      <Tab.Screen name="Profile" component={MyProfileScreen} />
      <Tab.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
        }}
      />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
});
