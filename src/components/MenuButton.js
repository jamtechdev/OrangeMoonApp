/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {AppStyles} from '../utils/AppStyles';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function MenuButton(props) {
  const { active, icon, onPress, title } = props; 
  return (
    <TouchableHighlight
      onPress={onPress}
      style={active ? styles.btnClickContainActive : styles.btnClickContain}
      underlayColor="rgba(128, 128, 128, 0.1)">
      <View style={styles.btnContainer}>
        <Icon
          name={icon}
          color={active ? AppStyles.color.tint : AppStyles.color.white}
          size={25}
        />
        <Text style={active ? styles.btnTextActive : styles.btnText}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  btnClickContainActive: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    borderBottomWidth: 1, 
    paddingVertical:15,
  },
  btnClickContain: {
    flexDirection: 'row',
    padding: 10,
    // marginTop: 5,
    // marginBottom: 10,
    paddingHorizontal: 30,
    borderBottomWidth:1,
    paddingVertical: 15, 
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  btnIcon: {
    height: 25,
    width: 25,
  },
  btnText: {
    fontSize: 18,
    marginLeft: 15,
    marginTop: 2,
    color: AppStyles.color.white,
  },
  btnTextActive:{
    fontSize: 18,
    marginLeft: 15,
    marginTop: 2,
    color: AppStyles.color.tint,
  }
});
