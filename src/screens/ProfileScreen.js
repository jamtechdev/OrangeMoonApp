/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Text, Divider, Card, Button, HelperText, RadioButton } from 'react-native-paper';
import { connect } from 'react-redux';
import globalStyles from '../utils/_css/globalStyle';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { AppStyles, AppIcon } from '../utils/AppStyles';
import InputLabelView from '../components/InputLabelView';
import { monitorService } from '../utils/_services';
import { getStateNamesByIds } from '../utils/_helpers';
function ProfileScreen({ user, navigation, token }) {
    const [profileData, setProfileData] = useState()
    // navigation.navigate('LoginStack')
    const [stateList, setStateList] = useState([]);
    useEffect(() => {
        setProfileData(user)
    }, [user])
    const imagesrc = 'https://staging.orangemoonsss.com/images/' + profileData?.monitor?.photo;
    useEffect(() => {
        monitorService.getStateList(token).then(res => {
            setStateList(res.data.states);
            console.log(res.data.states)
        }).catch(error => {
            console.log(error);
        });

    }, [])

    return (
        <ScrollView style={styles.container} nestedScrollEnabled={true} >
            <Card style={styles.card}>
                <Card.Content >
                    <View style={styles.content}>
                        <Avatar.Image size={150} source={{ uri: imagesrc }} style={styles.profileImage} />
                    </View>
                    {/* onPress={() => navigation.navigate('CompleteReportStack')} */}
                    <Text style={styles.heading} > Profile Details </Text>
                    <Text style={styles.heading} onPress={() => navigation.navigate('LoginStack')}> logp Details </Text>
                    {/* <Text style={styles.heading} onPress={() => navigation.navigate('PaymentStack')}> Profile Details </Text> */}
                    <Divider style={globalStyles.divider} />
                    <View style={styles.detailsContainer}>
                        <InputLabelView label="First Name" value={profileData?.first_name} />
                        <InputLabelView label="Last Name" value={profileData?.last_name} />
                        <InputLabelView label="Email " value={profileData?.email} />
                        <InputLabelView label="Hourly Rate" value={profileData?.monitor?.payRate.toString()} />
                        <InputLabelView label="DOB " value={profileData?.monitor?.d_o_b} />
                        <InputLabelView label="Gender " value={profileData?.monitor?.gender} />
                        <InputLabelView label="Shirt Size " value={profileData?.monitor?.shirt_size} />
                        <InputLabelView label="Social Security " value={profileData?.monitor?.social_security} password={true} />
                        <InputLabelView label="Address " value={profileData?.monitor?.address} />
                        <InputLabelView label="Phone " value={profileData?.monitor?.phone} />
                        <InputLabelView label="Emergency Contact Name " value={profileData?.monitor?.emergency_contact_name} />
                        <InputLabelView label="Emergency Contact Phone " value={profileData?.monitor?.emergency_contact_phone} />
                        <InputLabelView label="State " value={profileData?.monitor?.state.state_name} />
                        <InputLabelView label="City " value={profileData?.monitor?.city.city_name} />
                        <InputLabelView label="Zipcode " value={profileData?.monitor?.zip_code} />
                        <InputLabelView label="Preferred Job Location " value={getStateNamesByIds(profileData?.monitor?.preferred_location, stateList)} multiline={true} />
                        <InputLabelView label="Medical Conditions/Allergies " value={profileData?.monitor?.medical_condition} multiline={true} />
                        <InputLabelView label="Password " value={profileData?.password} password={true} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button style={globalStyles.inputStyle} textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" onPress={() => navigation.navigate('EditProfile')}>
                            Edit Profile
                        </Button>
                    </View>
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
    buttonContainer: {
        marginBottom: 10,
        marginTop: 5,
        alignItems: 'center',
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
    token: state.auth.token,
});

export default connect(mapStateToProps)(ProfileScreen);
