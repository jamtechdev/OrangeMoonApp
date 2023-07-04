/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { connect } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';

function PaymentScreen({ navigation, user }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCVC] = useState('');

  const handlePayment = () => {
    // Perform Stripe payment integration here
    console.log('Payment processed');
  };
  return (
    <ScrollView >
      <View style={styles.container}>
        <Title style={styles.title}>Stripe Payment</Title>
        <TextInput
          label="Card Number"
          value={cardNumber}
          onChangeText={(text) => setCardNumber(text)}
          style={styles.input}
        />
        <TextInput
          label="Expiry Date"
          value={expiryDate}
          onChangeText={(text) => setExpiryDate(text)}
          style={styles.input}
        />
        <TextInput
          label="CVC"
          value={cvc}
          onChangeText={(text) => setCVC(text)}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handlePayment}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Pay
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
