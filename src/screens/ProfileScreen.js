/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Text, Divider, Card, Button, HelperText, RadioButton } from 'react-native-paper';
import { connect } from 'react-redux';
import globalStyles from '../utils/_css/globalStyle';

import { AppStyles, AppIcon } from '../utils/AppStyles';
import InputLabelView from '../components/InputLabelView';
import { monitorService } from '../utils/_services';
import { getStateNamesByIds } from '../utils/_helpers';
function ProfileScreen({ user, navigation, token }) {
    const [profileData, setProfileData] = useState()
    // navigation.navigate('LoginStack')
    const [stateList, setStateList] = useState([]);
    const [state, setState] = useState('');
    useEffect(() => {
        setProfileData(user)
    }, [user])
    const imageSrc = 'https://staging.orangemoonsss.com/images/' + profileData?.monitor?.photo;
    useEffect(() => {
        monitorService.getStateList(token).then(async res => {
            setStateList(res.data.states);
            let stateData = await getStateNamesByIds(profileData?.monitor?.preferred_location, stateList)
            setState(stateData);
            console.log(typeof stateData, "data")
        }).catch(error => {
            console.log(error);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(profileData?.monitor?.d_o_b , 'profileData?.monitor?.d_o_b');

    return (
        <ScrollView style={styles.container} nestedScrollEnabled={true} >
            <Card style={globalStyles.card}>
                <Card.Content >
                    <View style={styles.content}>
                        <Avatar.Image size={150} source={{ uri: imageSrc }} style={styles.profileImage} />
                    </View>
                    <Text style={styles.heading} > Profile Details </Text>
                    {/* <Text style={styles.heading} onPress={() => navigation.navigate('LoginStack')}> logp Details </Text>
                    <Text style={styles.heading} onPress={() => navigation.navigate('CompleteReportStack')}> Profile Details </Text> */}
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
                        {state !== '' && (<InputLabelView label="Preferred Job Location " value={state} multiline={true} />)}
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
    },
    buttonContainer: {
        marginBottom: 10,
        marginTop: 5,
        alignItems: 'center',
    },
});

const mapStateToProps = (state) => ({
    user: state.auth.user,
    token: state.auth.token,
});

export default connect(mapStateToProps)(ProfileScreen);
