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
                <Paragraph>Group_name : {bookingDetails?.booking?.group_name} </Paragraph>
                <Paragraph>status : {bookingDetails?.status} </Paragraph>
                <Paragraph>booking  : {bookingDetails?.booking?.group_name} </Paragraph>
                <Paragraph>Assigned by : {bookingDetails?.assigned_by} </Paragraph>

                <Paragraph>holiday_amount : {bookingDetails?.booking?.holiday_amount} </Paragraph>
                <Paragraph>hotel_id : {bookingDetails?.booking?.hotel_id} </Paragraph>
                <Paragraph>parking_fee : {bookingDetails?.booking?.parking_fee} </Paragraph>
                <Paragraph>start_date : {bookingDetails?.booking?.start_date} </Paragraph>
                <Paragraph>start_time : {bookingDetails?.booking?.start_time} </Paragraph>
                <Paragraph>no_of_student : {bookingDetails?.booking?.no_of_student} </Paragraph>
                <Paragraph>no_of_monitor : {bookingDetails?.booking?.no_of_monitor} </Paragraph>
                <Paragraph>no_of_floor : {bookingDetails?.booking?.no_of_floor} </Paragraph>
                <Paragraph>notes : {bookingDetails?.booking?.notes} </Paragraph>
                <Paragraph>gl_contact_no : {bookingDetails?.booking?.gl_contact_no} </Paragraph>
                <Paragraph>end_date : {bookingDetails?.booking?.end_date} </Paragraph>
                <Paragraph>end_time : {bookingDetails?.booking?.end_time} </Paragraph>

                <Paragraph> Hotel name : {bookingDetails?.booking?.hotel?.name} </Paragraph>
                <Paragraph> Hotel phone : {bookingDetails?.booking?.hotel?.phone} </Paragraph>
                <Paragraph> Hotel place_id : {bookingDetails?.booking?.hotel?.place_id} </Paragraph>
                <Paragraph> Hotel zip_code : {bookingDetails?.booking?.hotel?.zip_code} </Paragraph>
                <Paragraph> Hotel state_id : {bookingDetails?.booking?.hotel?.state_id} </Paragraph>
                <Paragraph> Hotel address : {bookingDetails?.booking?.hotel?.address} </Paragraph>
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