/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { List, Card, Divider, Button, TextInput, Text, Title, DataTable, Paragraph, PaperText, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import InputLabelView from '../components/InputLabelView';
import { monitorService } from '../utils/_services';
import LoadingContainer from '../components/LoadingContainer';
import globalStyles from '../utils/_css/globalStyle';
import PreCheckCardList from '../components/cards/PreCheckCardList';
import ActivitiesCardList from '../components/cards/ActivitiesCardList';
import IncidentCardList from '../components/cards/IncidentCardList';
import { AppStyles } from '../utils/AppStyles';
import { formatDate, pdfGenerator } from '../utils/_helpers';

function DetailsReport({ navigation, route, user, token }) {
    const [reportDetails, setReportDetails] = useState()
    const [monitorBookingDayReport, setMonitorBookingDayReport] = useState([])
    const [bookingDayDetails, setBookingDayDetails] = useState([])
    const [preCheckQuestions, setPreCheckQuestions] = useState([])
    const [incidents, setIncidents] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    const [monitorActivitySorted, setMonitorActivitySorted] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [ header, setHeader ] = useState('')    

    const handleRefresh = () => {
        setRefreshing(true);
        detailsData();
    }

    useEffect(() => {
        console.log(route,"here route ")
        detailsData()
    }, [route, token])

    const detailsData = ()=>{
        if (route.params && route.params.Booking) {
            setHeader(route.params.header)
            const paramsData = {
                id: route.params.Booking.id,
                start_Time: route.params.Booking.start_Time,
                end_Time: route.params.Booking.end_Time,
            }
            monitorService.getAllDetailsReport(token, paramsData).then(res => {
                console.log(res)
                setReportDetails(res?.data);
                setMonitorBookingDayReport(res?.data?.monitorBookingDayReport);
                setBookingDayDetails(res?.data?.monitorBookingDetails);
                setPreCheckQuestions(res?.data?.precheckQuestions);
                setMonitorActivitySorted(res?.data?.monitorActivitySorted);
                setIncidents(res?.data?.incidents);
                setIsLoading(false)
            }).catch(error => { 
                setIsLoading(false);
                console.log(error); 
            }).finally(() => {
                setRefreshing(false);
              });
        }
    }

    return (
        <>
      {isLoading && 
      <Portal>
        <LoadingContainer />
      </Portal>
      }
            {!isLoading && reportDetails && (
                <ScrollView style={styles.main}
                 refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={AppStyles.color.tint} // Change the color of the loading indicator
                    />
                }
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <Card style={styles.card} >
                        { header == 'report' && (
                            <>
                            <View style={globalStyles.buttonRow}>
                            <Text style={globalStyles.subtitle}>Nightly Activity Report </Text>
                            <Pressable style={styles.badgeButtonDisable} onPress={() => pdfGenerator(bookingDayDetails,monitorBookingDayReport, preCheckQuestions,monitorActivitySorted,incidents)}>
                                 <Text style={styles.badgeButtonText}>Export PDF</Text>
                              </Pressable>
                            </View>
                            </>
                        )}
                        { header == 'today' && (
                            <Text style={globalStyles.subtitle}>Booking Day Details </Text>
                        )}
                            <Divider style={globalStyles.divider} />
                            <Card.Content>
                                {monitorBookingDayReport && bookingDayDetails &&
                                    <View style={styles.accountDetailsContainer}>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Monitor Name  </Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.first_name} {bookingDayDetails?.last_name} </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Date </Text>
                                            <Text style={styles.valueText}>{formatDate(bookingDayDetails?.date) || '-'} </Text>
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
                            </Card.Content>
                        </Card>
                        <View style={styles.nextView}>
                            <Card style={styles.card} >
                                <Text style={globalStyles.subtitle}>Pre-Checks</Text>
                                <Divider style={globalStyles.divider} />
                                <View style={{marginVertical:10}}>
                                   {
                                    preCheckQuestions && preCheckQuestions.map((item, index)=>{
                                        return(
                                            <PreCheckCardList
                                                key={index}
                                                item={item}
                                            />
                                        )
                                    })
                                   }
                                   </View>
                            </Card>
                        </View>
                        <View style={styles.nextView}>
                            <Card style={styles.card} >
                                <Text style={globalStyles.subtitle}>Activities</Text>
                                <Divider style={globalStyles.divider} />
                                <View style={{marginVertical:10}}>
                                {
                                    monitorActivitySorted && monitorActivitySorted.map((item, index)=>{
                                        return(
                                            <ActivitiesCardList
                                                key={index}
                                                item={item}
                                            />
                                        )
                                    })
                                   }
                                </View>    
                            </Card>
                        </View>
                        <View style={styles.nextView}>
                            <Card style={styles.card} >
                                <Text style={globalStyles.subtitle}>Incident Reports</Text>
                                <Divider style={globalStyles.divider} />
                                <View style={{marginVertical:10}}>
                                {
                                    incidents && incidents.map((item, index)=>{ 
                                        return(
                                            <IncidentCardList
                                                key={index}
                                                item={item}
                                            />
                                        )
                                    })
                                   }
                                   </View>
                            </Card>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 10,
        marginBottom: 15,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 22,
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
        marginTop: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        padding: 3,
    },
    keyText: {
        flex: 1,
        fontWeight: '700',
        color: '#777',
        marginRight: 4, // Add some margin for separation
        fontSize: 12
    },
    valueText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 12
    },
    DataTable: {
        marginTop: 20
    },
    nextView: {
        marginVertical: 10,
    },
    card: {
        padding: 15,
        backgroundColor: '#fcfcfc'
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
      },
      tableHeader: {
        fontWeight: 'bold',
        fontSize: 16,
        padding:10,
      },
      tableCell: {
        fontSize: 16,
        paddingLeft: 8,
      },
      badgeButtonDisable:{
        backgroundColor: AppStyles.color.tint,
        paddingVertical: 1,
        paddingHorizontal: 15,
        fontSize:12,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // opacity:0.7
      },
      badgeButtonText: {
        fontSize: 12,
        color: '#fff',
        fontWeight:600
      },
});


const mapStateToProps = (state) => ({
    user: state.auth.user,
    token: state.auth.token,
    value: state.auth.value
});

export default connect(mapStateToProps)(DetailsReport);