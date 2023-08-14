/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useLayoutEffect } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { AppStyles, AppIcon } from '../utils/AppStyles';
import globalStyles from '../utils/_css/globalStyle';

function WelcomeScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={[{ marginBottom: 150, }, globalStyles.container]}>
      <FastImage
        style={globalStyles.logo}
        source={AppIcon.images.logo}
      />
      <Text style={[globalStyles.title, { marginTop: 70, }]}>Welcome </Text>
      <Text style={[globalStyles.title, { marginBottom: 20, }]}> Orange Moon SSS </Text>

      <Button style={globalStyles.inputStyle} buttonColor={AppStyles.color.tint} mode="contained" onPress={() => navigation.navigate('Sign-In')}>
        Sign In
      </Button>
      {/* <Button style={globalStyles.inputStyle} textColor={AppStyles.color.secondaryColor} buttonColor={AppStyles.color.white} mode="outlined" onPress={() => navigation.navigate('Sign-Up')}>
        Sign Up
      </Button> */}
    </View>
  );
}

export default WelcomeScreen;