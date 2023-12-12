import { View, Text,ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image';
import { AppIcon, AppStyles } from '../utils/AppStyles';
import { API_URL } from '../utils/Connection';
import {  } from 'react-native-paper';

const Splash = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <FastImage
          style={{ width: 180, height: 180 }}
          source={AppIcon.images.logo}
        />
      </View>
      <View style={styles.loader}>
        <ActivityIndicator style={{marginTop:50}} size={30} color={AppStyles.color.tint} />
        <Text style={styles.logoText}> Loading...</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#232530'
  },
  logoSection:{
    backgroundColor:'#fff',
    padding:15,
    borderRadius:20
  },
  logoText:{
    color:'#fff',
    fontSize:20,
    marginTop:50
  },
  loader:{
    alignItems: 'center',
    flexDirection:'row',
    gap:5
  }
});

export default Splash