/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Linking, Pressable, Alert } from 'react-native';
import MenuButton from './MenuButton';
import { AppIcon } from '../utils/AppStyles';
import { connect } from 'react-redux';
import { logoutSuccess } from '../redux/actions/authActions';
import { authService } from '../utils/_services';
import { Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';

function DrawerContainer({ navigation, auth, logout }) {
  const [active, setActive] = useState(0);
  const handleLogout = () => {
    const { token } = auth;
    // authService.logout(token).then(res => {
    //   console.log(res);
    // }).catch(error => {
    //   console.log(error)
    // })
    navigation.navigate('LoginStack')
    setTimeout(() => {
      logout();
    }, 1500);

  };

  const handleLink = async (type) => {
    let url = 'https://orangemoonsss.com/privacy-policy'
    if (type == 'terms') {
      url = 'https://orangemoonsss.com/terms-of-service'
    }
    const supported = await Linking.openURL(url);
    if (supported) {
      // Open the URL in the default browser
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open URL: " + url);
    }
  };

  return (
    <View style={[styles.content, { backgroundColor: '#232530' }]}>
      <View style={[styles.view, { backgroundColor: '#201f2b' }]}>
        <FastImage
          style={{ width: 70, height: 70 }}
          source={AppIcon.images.logo}
        />
        <Text style={{ color: '#fff' }} variant="headlineMedium"> Orange Moon</Text>
      </View>
      <View style={styles.container}>
<View style={styles.subContainer}>
          <MenuButton
            title="Home"
            icon='home'
            active={active === 0 ? true : false}
            onPress={() => {
              setActive(0);
              navigation.navigate('Tab');
            }}
          />
          <MenuButton
            title="Archive Booking"
            icon='book'
            active={active === 1 ? true : false}
            onPress={() => {
              setActive(1);
              navigation.navigate('ArchiveBookingStack');
            }}
          />
          <MenuButton
            title="Scheduling"
            icon='table'
            active={active === 2 ? true : false}
            onPress={() => {
              setActive(2);
              navigation.navigate('SchedulingStack');
            }}
          />
          <MenuButton
            title="Completed Reports"
            icon='clone'
            active={active === 3 ? true : false}
            onPress={() => {
              setActive(3);
              navigation.navigate('CompleteReportStack');
            }}
          />



          <MenuButton
            title="Conversations"
            icon='wechat'
            active={active === 4 ? true : false}
            onPress={() => {
              setActive(4);
              navigation.navigate('ChatStack');
            }}
          />
          <MenuButton
            title="Payments"
            icon='credit-card'
            active={active === 5 ? true : false}
            onPress={() => {
              setActive(5);
              navigation.navigate('PaymentStack');
            }}
          />
          <MenuButton
            title="Log Out"
            icon='power-off'
            active={false}
            onPress={() => {
              // setActive(5)
              handleLogout()
            }}
          />
</View>

        <View style={styles.subContainer1}>
          <Pressable onPress={() => handleLink('link')}>
            <Text style={styles.fontStyle}> Privacy Policy</Text>
          </Pressable>
          <Pressable onPress={() => handleLink('terms')}>
            <Text style={styles.fontStyle}> Terms of Service</Text>
          </Pressable>
          {/* <Text style={styles.fontStyle}> Version : 1.0.1</Text> */}
        </View>
      </View>


    </View>

  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  view: {
    paddingVertical: 15,
    paddingLeft: 10,
    paddingTop: 35,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between'
    // paddingHorizontal: 20,
  },
  subContainer: {
    flex: 1,
    alignItems: 'flex-start',

  },
  subContainer1: {

    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 30,
    paddingBottom: 35,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end'
  },
  fontStyle: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logoutSuccess()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);