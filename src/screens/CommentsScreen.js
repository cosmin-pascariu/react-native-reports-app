import {StyleSheet, Text, ScrollView, Button, View} from 'react-native';
import React from 'react';
import Comment from '../components/Comment';
import NoPostsScreen from './NoPostsScreen';
import uuid from 'react-native-uuid';

export default function CommentsScreen({route}) {
  return (
    <ScrollView>
      <View style={styles.container}>
        {route?.params?.comments.map(comment => (
          <Comment
            key={uuid.v4()}
            userId={comment.userId}
            comment={comment.comment}
            commentTimeStamp={comment.commentTimeStamp}
          />
        ))}
        {route?.params?.comments.length === 0 && <NoPostsScreen />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
