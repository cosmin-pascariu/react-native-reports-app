/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {useState, useEffect} from 'react';

import {Image, Text, View, StyleSheet, Button, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AddScreen from './screens/AddScreen';
import FavouritesScreen from './screens/FavouritesScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import firestore from '@react-native-firebase/firestore';

function HomeScreen({navigation}) {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const [deletedUser, setDeletedUser] = useState('');
  const [deletedUserId, setDeletedUserId] = useState('');

  useEffect(() => {
    firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push(doc.data());
        });
        console.log(docs);
        setUsers(docs);
      });
  }, []);

  const addNewUser = () => {
    firestore()
      .collection('users')
      .add({
        name: userName,
      })
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });
  };

  const deleteUser = id => {
    firestore()
      .collection('users')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch(error => {
        console.error('Error removing document: ', error);
      });
  };

  const getUserId = firestore()
    .collection('users')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.data().name === deletedUser ? setDeletedUserId(doc.id) : false;
      });
    });

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {users.map(user => (
        <Text key={user.id}>FullName: {user.name} </Text>
      ))}
      <Button
        title="Show user data in console"
        onPress={() => console.log(users)}
      />
      <TextInput
        placeholder="Enter name"
        value={userName}
        onChangeText={text => setUserName(text)}
      />
      <Button
        title="Add user"
        onPress={userName !== '' ? () => addNewUser() : console.log('No name')}
      />
      <TextInput
        placeholder="Enter name"
        value={deletedUser}
        onChangeText={text => setDeletedUser(text)}
      />
      <Button
        title="Delete user"
        onPress={
          deletedUser !== ''
            ? () => deleteUser(deletedUserId)
            : console.log('No name')
        }
      />
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

function App() {
  const [numberOfFav, setNumberOfFav] = useState(2);

  const handleNumberOfFav = () => {
    setNumberOfFav(numberOfFav + 1);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
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
                  source={require('./assets/images.jpeg')}
                  style={styles.headerProfile}
                />
              </View>
            ),
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            tabBarBadgeStyle: {backgroundColor: 'red'},
          })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Search" component={HomeScreen} />
          <Tab.Screen name="Add" component={AddScreen} />
          <Tab.Screen
            name="Favourites"
            component={FavouritesScreen}
            options={{tabBarBadge: numberOfFav}}
            onPress={() => handleNumberOfFav}
          />
          <Tab.Screen name="MyPosts" component={HomeScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
export default App;

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
