import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import React from 'react';

export default function NoPostsScreen() {
  const DISPLAYED_MESSAGE = 'There si currently no data to display...';

  return (
    <View style={styles.noPostsContainer}>
      <Image
        source={require('../assets/noData.png')}
        style={styles.noDataImage}
      />
      <Text style={styles.noDataText}>{DISPLAYED_MESSAGE}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noPostsContainer: {
    height: Dimensions.get('window').height - 200,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataImage: {
    width: Dimensions.get('window').width * 0.75,
    height: Dimensions.get('window').width * 0.75,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#323232',
    marginTop: 10,
  },
});
