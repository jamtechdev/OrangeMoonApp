/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { connect, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { login } from '../reducers';
import { AppStyles } from '../utils/AppStyles';

function WelcomeScreen({ navigation }) {
  const auth = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (auth?.isLoggedIn) {
      navigation.navigate('DrawerStack');
    }
  }, []);

  return (
    <View style={styles.container}>
      <FastImage
        style={{ width: 200, height: 200 }}
        source={{
          uri:
            'https://img1.wsimg.com/isteam/ip/e5efb5b2-e0c9-49e4-8d56-56ef04be68f7/Orange-Moon-Student-Safety-Services.png/:/rs=w:311,h:200,cg:true,m/cr=w:311,h:200/qt=q:95',
        }}
      />
      <Text style={styles.title}>Welcome Orange Moon</Text>
      <TouchableOpacity
        style={styles.loginContainer}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signupContainer}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 150,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  loginContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  signupContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.white,
    borderRadius: AppStyles.borderRadius.main,
    padding: 8,
    borderWidth: 1,
    borderColor: AppStyles.color.tint,
    marginTop: 15,
  },
  signupText: {
    color: AppStyles.color.tint,
  },
  spinner: {
    marginTop: 200,
  },
});

// const mapStateToProps = (state) => ({
//   user: state.auth.user,
// });

// export default connect(mapStateToProps)(WelcomeScreen);
export default WelcomeScreen;