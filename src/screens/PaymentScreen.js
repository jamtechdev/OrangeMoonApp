/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { connect } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';

function PaymentScreen({ navigation, user }) {



  const handlePayment = async() => {
    const url = 'https://connect.stripe.com/express/oauth/v2/authorize?response_type=code&scope=read_write&redirect_uri=https%3A%2F%2Fstaging.orangemoonsss.com%2Fstripe%2Fconnect-stripe-redirect&client_id=ca_Kz1aOhcWevW0ykZu1nnhOHp07QrKyBB5';

    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Open the URL in the default browser
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open URL: " + url);
    }
  };
  return (
    <ScrollView >
      <View style={styles.container}>
        <Title style={styles.title}>Stripe Connect </Title>
        <Button
          mode="contained"
          onPress={handlePayment}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          + Connect Stripe
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  buttonContent: {
    height: 48,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(PaymentScreen);
