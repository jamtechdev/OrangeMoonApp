/* eslint-disable prettier/prettier */
/* eslint-disable keyword-spacing */
import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Pressable, FlatList} from 'react-native';
import {
  Portal,
  Dialog,
  Button,
  Text,
  DataTable,
  Divider,
  SegmentedButtons,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppStyles } from '../utils/AppStyles';

export default function NoDataFound(){

    return(
        <View  style={styles.emptyData}>
        <Icon size={50} color={AppStyles.color.tint} name='file-o' />
        <Text style={styles.textnotfound}>Data not found</Text>
        </View>
    )
} 

const styles = StyleSheet.create({
    emptyData: {
        paddingVertical: '50%',
        justifyContent:'center',
        alignItems:'center',
        fontWeight:'100',
        gap:15,
        color:'red',
        backgroundColor:'#efefef',
        borderRadius:20,
    },
    textnotfound:{
        fontSize:18,
        color:AppStyles.color.tint,
        fontWeight:600,
    }
})