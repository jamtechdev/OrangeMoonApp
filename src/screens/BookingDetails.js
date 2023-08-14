/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState , useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { List, Card, Avatar, Title, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import { AppStyles, AppIcon } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';
import { monitorService } from '../utils/_services';

function BookingDetails({ navigation,route, user ,value,  token}) {
  const [bookingDetails, setBookingDetails] = useState()
  useEffect(()=>{
    monitorService.bookingDetails(token, value).then(res=>{
        setBookingDetails(res?.data?.data)
    }).catch(error=>console.log(error))
  },[value])
  console.log(bookingDetails, "here my details")
  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <List.Section>
          { bookingDetails && (
            <Card  style={styles.card}>
              <Card.Title title={`Booking Id :  ${bookingDetails?.booking_id}`} />
              <Card.Content>
                <Paragraph>Group Name : {bookingDetails?.booking?.group_name} </Paragraph>
                <Paragraph>Status : {bookingDetails?.status} </Paragraph>
                <Paragraph>Assigned by : {bookingDetails?.assigned_by} </Paragraph>

                <Paragraph>Holiday Amount : {bookingDetails?.booking?.holiday_amount} </Paragraph>
                <Paragraph>Hotel Id : {bookingDetails?.booking?.hotel_id} </Paragraph>
                <Paragraph>Parking Fee : {bookingDetails?.booking?.parking_fee} </Paragraph>
                <Paragraph>Start Date : {bookingDetails?.booking?.start_date} </Paragraph>
                <Paragraph>Start Time : {bookingDetails?.booking?.start_time} </Paragraph>
                <Paragraph>No of Student : {bookingDetails?.booking?.no_of_student} </Paragraph>
                <Paragraph>No of Monitor : {bookingDetails?.booking?.no_of_monitor} </Paragraph>
                <Paragraph>No of Floor : {bookingDetails?.booking?.no_of_floor} </Paragraph>
                <Paragraph>Notes : {bookingDetails?.booking?.notes} </Paragraph>
                <Paragraph>Gl Contact No : {bookingDetails?.booking?.gl_contact_no} </Paragraph>
                <Paragraph>end Date : {bookingDetails?.booking?.end_date} </Paragraph>
                <Paragraph>End Time : {bookingDetails?.booking?.end_time} </Paragraph>

                <Paragraph> Hotel Name : {bookingDetails?.booking?.hotel?.name} </Paragraph>
                <Paragraph> Hotel Phone : {bookingDetails?.booking?.hotel?.phone} </Paragraph>
                <Paragraph> Hotel Place_id : {bookingDetails?.booking?.hotel?.place_id} </Paragraph>
                <Paragraph> Hotel Zip_code : {bookingDetails?.booking?.hotel?.zip_code} </Paragraph>
                <Paragraph> Hotel State Id : {bookingDetails?.booking?.hotel?.state_id} </Paragraph>
                <Paragraph> Hotel Address : {bookingDetails?.booking?.hotel?.address} </Paragraph>
              </Card.Content>
            </Card>
          )}
          {!bookingDetails && (<Text> Data loading .......</Text>) }
        </List.Section>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  card: {
    marginBottom: 16,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token : state.auth.token,
  value: state.auth.value
});

export default connect(mapStateToProps)(BookingDetails);