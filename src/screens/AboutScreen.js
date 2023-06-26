/* eslint-disable prettier/prettier */
import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';

function AboutScreen({ navigation, user }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'About',
    });
  }, [navigation]);

  const route = () => {
    navigation.navigate('LoginStack');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to About Screen {user?.name ?? 'User'}</Text>
      <TouchableOpacity onPress={route} style={styles.button}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
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
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// const mapStateToProps = (state) => ({
//   user: state.auth.user,
// });

// export default connect(mapStateToProps)(AboutScreen);


export default AboutScreen;