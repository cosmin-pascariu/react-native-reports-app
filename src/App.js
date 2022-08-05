/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Image, Text, View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AddScreen from './screens/AddScreen';

function HomeScreen({navigation}) {
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </SafeAreaView>
  );
}

function FavouritesScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Favourites Screen</Text>
    </View>
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
              } else if (route.name === 'Favourites') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else if (route.name === 'Add') {
                iconName = focused ? 'duplicate' : 'duplicate-outline';
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
          <Tab.Screen name="Add" component={AddScreen} />
          <Tab.Screen
            name="Favourites"
            component={FavouritesScreen}
            options={{tabBarBadge: numberOfFav}}
            onPress={() => handleNumberOfFav}
          />
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
