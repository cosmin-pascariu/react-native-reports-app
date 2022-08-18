import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native';
import React from 'react';

export default function MyProfileScreen() {
  return (
    <SafeAreaProfider>
      <SafeAreaView style={styles.container}>
        <Text>MyProfileScreen</Text>
      </SafeAreaView>
    </SafeAreaProfider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
