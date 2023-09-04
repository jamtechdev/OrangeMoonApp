/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { List, Card, Divider, Button, TextInput, Text, Title, DataTable, Paragraph, PaperText } from 'react-native-paper';
import { connect } from 'react-redux';
import InputLabelView from '../components/InputLabelView';
import { monitorService } from '../utils/_services';
import LoadingContainer from '../components/LoadingContainer';
import globalStyles from '../utils/_css/globalStyle';


function DetailsReport({ navigation, route, user, token }) {
    const [reportDetails, setReportDetails] = useState()
    const [monitorBookingDayReport, setMonitorBookingDayReport] = useState([])
    const [bookingDayDetails, setBookingDayDetails] = useState([])
    const [preCheckQuestions, setPreCheckQuestions] = useState([])
    const [incidents, setIncidents] = useState([])
    const [monitorActivitySorted, setMonitorActivitySorted] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    console.log(token)
    useEffect(() => {
        if (route.params && route.params.Booking) {
            const paramsData = {
                id: route.params.Booking.id,
                start_Time: route.params.Booking.start_Time,
                end_Time: route.params.Booking.end_Time,
            }
            monitorService.getAllDetailsReport(token, paramsData).then(res => {
                setReportDetails(res?.data);
                setMonitorBookingDayReport(res?.data?.monitorBookingDayReport);
                setBookingDayDetails(res?.data?.monitorBookingDetails);
                setPreCheckQuestions(res?.data?.precheckQuestions);
                setMonitorActivitySorted(res?.data?.monitorActivitySorted);
                setIncidents(res?.data?.incidents);
                console.log(res?.data);
                setIsLoading(false)
            }).catch(error => { setIsLoading(false); console.log(error); });
        }
    }, [route, token])
    return (
        <>
            {isLoading && (
                <LoadingContainer />
            )}
            {!isLoading && reportDetails && (
                <ScrollView ScrollView >
                    <View style={styles.container}>
                        <Text style={styles.title}>Nightly Activity Report </Text>
                        <Divider style={globalStyles.divider} />
                        {monitorBookingDayReport && bookingDayDetails &&
                            <View style={styles.accountDetailsContainer}>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} >Monitor Name  </Text>
                                    <Text style={styles.valueText}>{bookingDayDetails?.first_name} {bookingDayDetails?.last_name} </Text>
                                </View>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} >Date </Text>
                                    <Text style={styles.valueText}>{bookingDayDetails?.date || '-'} </Text>
                                </View>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} >Wellness Check Status </Text>
                                    <Text style={styles.valueText}>{monitorBookingDayReport?.temperature || '-'}  </Text>
                                </View>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} >Group Name</Text>
                                    <Text style={styles.valueText}>{bookingDayDetails?.group_name || '-'}  </Text>
                                </View>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} ># Of Students </Text>
                                    <Text style={styles.valueText}>{bookingDayDetails?.no_of_students || '-'}  </Text>
                                </View>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} ># Of Floors </Text>
                                    <Text style={styles.valueText}>{bookingDayDetails?.no_of_floor || '-'}  </Text>
                                </View>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} >TD/GL Name </Text>
                                    <Text style={styles.valueText}>{bookingDayDetails?.gl_name || '-'}  </Text>
                                </View>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} >TD/GL Phone </Text>
                                    <Text style={styles.valueText}>{bookingDayDetails?.gl_phone || '-'}  </Text>
                                </View>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} >Start Time </Text>
                                    <Text style={styles.valueText}>{monitorBookingDayReport?.start_time || '-'}  </Text>
                                </View>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} >End Time </Text>
                                    <Text style={styles.valueText}>{monitorBookingDayReport?.end_time || '-'}  </Text>
                                </View>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} >Start Location </Text>
                                    <Text style={styles.valueText}>{monitorBookingDayReport?.start_location_addr || '-'}  </Text>
                                </View>
                                <View style={styles.detailRow} >
                                    <Text style={styles.keyText} >End Location </Text>
                                    <Text style={styles.valueText}>{monitorBookingDayReport?.end_location_addr || '-'}  </Text>
                                </View>
                            </View>


                        }
                    </View>
                </ScrollView>
            )}
        </>
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
    accountDetailsContainer: {
        marginTop: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        marginHorizontal: 15
    },
    keyText: {
        flex: 1,
        fontWeight: '700',
        color: '#777',
        marginRight: 4, // Add some margin for separation
        fontSize: 14
    },
    valueText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 13
    },
    DataTable: {
        marginTop: 20
    }
});


const mapStateToProps = (state) => ({
    user: state.auth.user,
    token: state.auth.token,
    value: state.auth.value
});

export default connect(mapStateToProps)(DetailsReport);