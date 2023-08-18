/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MenuButton from '../components/MenuButton';
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
    authService.logout(token).then(res => {
      console.log(res);
    }).catch(error => {
      console.log(error)
    })
    navigation.navigate('LoginStack')
    setTimeout(() => {
      logout();
    }, 1500);

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
          title="Complete Report"
          icon='clone'
          active={active === 3 ? true : false}
          onPress={() => {
            setActive(3);
            navigation.navigate('CompleteReportStack');
          }}
        />
        <MenuButton
          title="Chat"
          icon='wechat'
          active={active === 4 ? true : false}
          onPress={() => {
            setActive(4);
            navigation.navigate('ChatStack');
          }}
        />
        <MenuButton
          title="Payment"
          icon='credit-card'
          active={active === 5 ? true : false}
          onPress={() => {
            setActive(5);
            navigation.navigate('PaymentStack');
          }}
        />
        <MenuButton
          title="Logout"
          icon='power-off'
          active={false}
          onPress={() => {
            handleLogout()
          }}
        />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  view: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    // paddingHorizontal: 20,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logoutSuccess()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);