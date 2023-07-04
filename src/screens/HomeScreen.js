/* eslint-disable prettier/prettier */
import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native'; // Import View
import { connect } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';
import { Surface, Text } from 'react-native-paper';

function HomeScreen({ navigation, user }) {
  const { first_name, last_name, email, online_status, status, user_type } = user;

  console.log(user, "===========================>>>>>>>>>>>>>>>>>")

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hii, {first_name} {last_name}</Text>
      <View style={styles.columnContainer}>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="titleMedium">User Details </Text>
          <Text>{email}</Text>
          <Text>User Type : {user_type }</Text>
        </Surface>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="titleMedium">User Status</Text>
          <Text>Status :  {status}</Text>
          <Text>Online Status :  {online_status}</Text>
        </Surface>
      </View>
      <View style={styles.columnContainer}>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="displaySmall">5</Text>
          <Text>Booking Requests </Text>
        </Surface>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="displaySmall">18</Text>
          <Text>Archive Booking</Text>
        </Surface>
      </View>
      <View style={styles.columnContainer}>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="displaySmall">15</Text>
          <Text>Scheduling</Text>
        </Surface>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="displaySmall">8</Text>
          <Text>Completed Reports</Text>
        </Surface>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: Configuration.home.listing_item.offset,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: AppStyles.color.title,
    marginBottom: 20,
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  surface: {
    padding: 8,
    height: 200,
    width: '47%', // Adjust the width as needed
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);
