/* eslint-disable no-alert */
/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View} from 'react-native';
import MenuButton from '../components/MenuButton';
import {AppIcon} from '../utils/AppStyles';
import { connect } from 'react-redux';
import { logoutSuccess } from '../redux/actions/authActions';
import { authService } from '../utils/_services';
function DrawerContainer({ navigation, user, logout }) {

  const handleLogout = () => {
    alert(JSON.stringify(user))
    authService.logout().then(res=>{
console.log(res);
    }).catch(error=>{
      // alert(error);
      console.log(error)
    })
    logout();
    navigation.navigate('loginStack')
  };
  
  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <MenuButton
          title="LOG OUT"
          source={AppIcon.images.logout}
          onPress={() => {
            handleLogout()
          }}
        />
          <MenuButton
          title="About"
          source={AppIcon.images.defaultUser}
          onPress={() => {
                navigation.navigate('AboutStack');
          }}
        />
          <MenuButton
          title="Contact"
          source={AppIcon.images.defaultUser}
          onPress={() => {
                navigation.navigate('ContactStack');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logoutSuccess()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);