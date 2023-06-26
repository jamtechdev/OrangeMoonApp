/* eslint-disable prettier/prettier */
import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';

function HomeScreen({ navigation, user }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',  
    });
  }, [navigation]);
console.log(user,"===========================>>>>>>>>>>>>>>>>>")
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome {user?.name ?? 'User'}</Text>
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
});

const mapStateToProps = (state) => ({
  user: state.auth,
});

export default connect(mapStateToProps)(HomeScreen);
// export default HomeScreen;