/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Text, Divider, Card, TextInput, HelperText, RadioButton } from 'react-native-paper';
import { connect } from 'react-redux';
import globalStyles from '../utils/_css/globalStyle';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { AppStyles, AppIcon } from '../utils/AppStyles';
import InputLabelView from '../components/InputLabelView';

function ProfileScreen({ user, navigation }) {
    const { first_name, last_name, email, monitor } = user;
    const imagesrc = 'https://staging.orangemoonsss.com/images/' + monitor?.photo;
    // navigation.navigate('LoginStack')
    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content >
                    <View style={styles.content}>
                        <Avatar.Image size={150} source={{ uri: imagesrc }} style={styles.profileImage} />
                    </View>
                    <Text style={styles.heading} onPress={() => navigation.navigate('PaymentStack')}> Profile Details </Text>
                    <Text style={styles.heading} onPress={() => navigation.navigate('LoginStack')}> logp Details </Text>
                    {/* <Text style={styles.heading} onPress={() => navigation.navigate('PaymentStack')}> Profile Details </Text> */}
                    <Divider style={globalStyles.divider} />
                    <View style={styles.detailsContainer}>
                        <InputLabelView label="First Name" value={first_name} />
                        <InputLabelView label="Last Name" value={last_name} />
                        <InputLabelView label="Email " value={email} />
                        <InputLabelView label="Hourly Rate" value={monitor?.payRate.toString()} />
                        <InputLabelView label="DOB " value={monitor?.d_o_b} />
                        <InputLabelView label="Gender " value={monitor?.gender} />
                        <InputLabelView label="Shirt Size " value={monitor?.shirt_size} />
                        <InputLabelView label="Address " value={monitor?.address} />
                        <InputLabelView label="Phone " value={monitor?.phone} />
                        <InputLabelView label="Emergency Contact Name " value={monitor?.emergency_contact_name} />
                        <InputLabelView label="State " value={monitor?.state_id.toString()} />
                        <InputLabelView label="City " value={monitor?.city_id.toString()} />
                        <InputLabelView label="Zipcode " value={monitor?.zip_code} />
                        <InputLabelView label="Social Security " value={monitor?.social_security} password={true} />
                        <InputLabelView label="Preferred Job Location " value={JSON.stringify(monitor?.preferred_location)} />
                        <InputLabelView label="Medical Conditions/Allergies " value={monitor?.medical_condition} multiline={true} />
                        <InputLabelView label="Password " value='123' password={true} />
                    </View>
                    {/* {/* <Title style={styles.username}>{first_name} {last_name}</Title>
                    <Caption style={styles.email}>Email :{email}</Caption> */}
                    {/* <Caption style={styles.rate}>Hourly Rate: ${monitor?.payRate}</Caption>
                    <View style={styles.infoContainer}>
                        <InfoItem label="DOB" value={monitor?.d_o_b} />
                        <InfoItem label="Gender" value={monitor?.gender} />
                    </View>

                    <InfoItem label="Address" value={monitor?.address} />
                    <InfoItem label="Phone" value={monitor?.phone} />
                    <InfoItem label="Emergency Contact Name" value={monitor?.emergency_contact_name} />
                    <InfoItem label="Emergency Contact Phone" value={monitor?.emergency_contact_phone} />
                    <View style={styles.infoContainer}>
                        <InfoItem label="State" value={monitor?.state_id} />
                        <InfoItem label="City" value={monitor?.city_id} />
                    </View>
                    <View style={styles.infoContainer}>
                        <InfoItem label="Zipcode" value={monitor?.zip_code} />
                        <InfoItem label="Shirt Size" value={monitor?.shirt_size} />
                    </View>
                    <InfoItem label="Social Security" value={monitor?.social_security} />
                    <InfoItem label="Preferred Job Location" value={JSON.stringify(monitor?.preferred_location)} />
                    <InfoItem label="Medical Conditions/Allergies" value={monitor?.medical_condition} />
                    <InfoItem label="Password" value="***" /> */}
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 2,
    },
    card: {
        marginBottom: 16,
    },
    detailsContainer: {
        marginTop: 20,
    },
    content: {
        alignItems: 'center',
    },
    profileImage: {
        marginBottom: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 700
        // marginBottom: 10,
    },
    // username: {
    //     fontSize: 24,
    //     fontWeight: 'bold',
    //     marginBottom: 10,
    // },
    // email: {
    //     fontSize: 18,
    //     fontWeight: '600',
    //     marginBottom: 15,
    //     textAlign: 'center',
    // },
    // rate: {
    //     fontSize: 16,
    //     marginBottom: 15,
    // },
    // infoContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     marginBottom: 5,
    // },
    // infoItem: {
    //     flexDirection: 'row',
    //     marginBottom: 10,
    // },
    // infoLabel: {
    //     fontSize: 16,
    //     fontWeight: '600',
    //     marginRight: 5,
    // },
    // infoValue: {
    //     fontSize: 16,
    // },
    // card: {
    //     width: '90%',
    //     padding: 10,
    //     marginTop: 10,
    // },
    // inputStyle: {
    //     width: '100%',
    //     marginBottom: 10,
    // },
    // radioGroup: {
    //     flexDirection: 'row', // Display radio buttons horizontally
    //     justifyContent: 'space-between', // Add space between radio buttons
    // },
    // label: {
    //     fontSize: 16,
    //     fontWeight: 600
    //     // marginBottom: 10,
    // },
    // labelContainer: {
    //     alignSelf: 'flex-start', // Align label to the left
    //     // marginBottom: 10,
    // },
});

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(ProfileScreen);
