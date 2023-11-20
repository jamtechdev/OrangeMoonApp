/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
//import liraries
//import liraries
import React, {Component, useState} from 'react';
import {
  Divider,
  Text,
  Portal,
  Button,
  Dialog,
  RadioButton,
  DataTable,
  TextInput,
  Card,
  HelperText,
  Snackbar,
} from 'react-native-paper';
import globalStyles from '../../utils/_css/globalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Configuration} from '../../utils/Configuration';
import {AppStyles} from '../../utils/AppStyles';
import {View, StyleSheet, ScrollView} from 'react-native';
import {monitorService} from '../../utils/_services';
const TokenAlert = () => {
  return (
    <Portal>
      <Dialog visible={true}>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Dialog.Title>Token Expired </Dialog.Title>
        </View>
        <Dialog.Content
          style={{
            minHeight: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ScrollView
            style={{
              ...globalStyles.cardContainer,
              minHeight: 90,
              paddingHorizontal: 0,
              paddingVertical: 0,
              backgroundColor: 'transparent',
            }}
            nestedScrollEnabled={true}>
            <Card
              style={{...globalStyles.card, minHeight: 300, padding: 10}}
              mode="contained">
              <Text style={{fontWeight: 'bold'}}>You need to Re-login</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 30,
                }}>
                <Button
                  textColor={AppStyles.color.white}
                  buttonColor={AppStyles.color.tint}
                  mode="contained-tonal"
                  style={styles.buttonStyle}>
                  Logout
                </Button>
              </View>
            </Card>
          </ScrollView>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

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
    marginBottom: 20,
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  surface: {
    padding: 8,
    height: 200,
    width: '47%', // Adjust the width as needed
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  model: {
    backgroundColor: 'white',
    padding: 20,
  },
});

export default TokenAlert;
