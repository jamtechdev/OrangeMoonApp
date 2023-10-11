/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
//import liraries
//import liraries
import React, { Component, useState } from 'react';
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
    Snackbar
} from 'react-native-paper';
import globalStyles from '../../utils/_css/globalStyle'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Configuration } from '../../utils/Configuration';
import { AppStyles } from '../../utils/AppStyles';
import { View, StyleSheet, ScrollView } from 'react-native';
import { monitorService } from '../../utils/_services';

const TodayBookingModel = ({ visible4, hideModal4, bookingId, token, setMessage, setVisible3 , item, location ,setItem}) => {
    const apiMonitorSubmit = () => {
        console.log('itme', item)
        const data = new Object ({
            Monitor_Booking_Day_Report_Id : item.monitor_booking_day_report.id,
            requestbody:{latlng : (location.latitude,location.longitude)}
        })
        monitorService.MonitorSubmitReport(token, data).then((res) =>{
            console.log('res',res)
            setMessage(res.data.message)
            setVisible3(true)
            setItem()
            hideModal4()
        }).catch((error) => {
            console.log("error",error)
            setMessage("Something went wrong")
            setVisible3(true)
            setItem()
            hideModal4()
        })
    }
    // monitorService.MonitorSubmitReport
    return (
        <Portal>
            <Dialog visible={visible4} onDismiss={hideModal4}>
                <View style={{ ...styles.rowView, alignItems: 'center', justifyContent: 'center' }}>
                    <Dialog.Title style={{ ...globalStyles.subtitle }}>Are you Sure?</Dialog.Title>
                </View>
                <Dialog.Content style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
                    <ScrollView style={{ ...globalStyles.cardContainer, minHeight: 90, paddingHorizontal: 0, paddingVertical: 0, backgroundColor: 'transparent' }} nestedScrollEnabled={true}>
                        <Card style={{ ...globalStyles.card, minHeight: 300, padding: 10}} mode='contained' >
                            <Text style={{ fontWeight: 'bold' }}>Submitting this report closes the job for the night.</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 30}}>
                                <Button textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" style={styles.buttonStyle} onPress={apiMonitorSubmit}>
                                    Yes
                                </Button>
                                <Button textColor={AppStyles.color.black} buttonColor={AppStyles.color.white} mode="contained-tonal" style={styles.buttonStyle} onPress={hideModal4}>
                                    No
                                </Button>
                            </View>
                        </Card>
                    </ScrollView>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
};

// define your styles
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


//make this component available to the app
export default TodayBookingModel;
