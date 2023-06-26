/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';

function ContactScreen({ navigation, user }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Contact',
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome on Contact Screen {user?.name ?? 'User'}</Text>
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
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
  },
});

// const mapStateToProps = (state) => ({
//   user: state.auth.user,
// });

// export default connect(mapStateToProps)(ContactScreen);
export default ContactScreen;