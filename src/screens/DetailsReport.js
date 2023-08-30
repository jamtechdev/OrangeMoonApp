/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { List, Card, TextInput, Title, Paragraph, PaperText } from 'react-native-paper';
import { connect } from 'react-redux';
import InputLabelView from '../components/InputLabelView';
import { monitorService } from '../utils/_services';
import LoadingContainer from '../components/LoadingContainer';

function DetailsReport({ navigation, route, user, value, token }) {
    const [reportDetails, setReportDetails] = useState()
    const [isLoading, setIsLoading] = useState(true)
    console.log(route, "here props ")
    // useEffect(() => {
    //     monitorService.bookingDetails(token, value).then(res => {
    //         setBookingDetails(res?.data?.data)
    //         setIsLoading(false)
    //     }).catch(error => { setIsLoading(false); console.log(error); })
    // }, [value])
    return (
        <>
            {isLoading && (
                <LoadingContainer />
            )}
            {!isLoading && reportDetails && (
                <ScrollView style={styles.container}>
                    <View style={styles.container}>
                        <List.Section>


                        </List.Section>
                    </View>
                </ScrollView>
            )}
            {!reportDetails && (<Text> Data not found</Text>)}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    card: {
        marginBottom: 16,
    },
    detailsContainer: {
        marginTop: 10,
    },
    detailItem: {
        // flexDirection: 'row',
        alignItems: 'start',
        marginBottom: 10,
    },
    labelText: {
        // width: '40%',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        textAlign: 'left',
        paddingBottom: 10,
    },
    valueInput: {
        flex: 1,
        marginBottom: 10
    },
});


const mapStateToProps = (state) => ({
    user: state.auth.user,
    token: state.auth.token,
    value: state.auth.value
});

export default connect(mapStateToProps)(DetailsReport);