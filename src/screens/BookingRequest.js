/* eslint-disable prettier/prettier */
import React, { useLayoutEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { List, Card, Avatar, Title, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import { AppStyles, AppIcon } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';

function BookingRequest({ navigation, user , token}) {
  const [bookingData, setBookingData] = useState()
  useEffect(()=>{
    monitorService.BookingRequest(token).then(res=>{
      // console.log(res,"here my console res");
      setBookingData(res?.monitorBookingDayRequest)
    }).catch(error=>console.log(error))
  })

  // const bookings = [
  //   {
  //     id: 1,
  //     title: 'Booking 1',
  //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  //   },
  //   {
  //     id: 2,
  //     title: 'Booking 2',
  //     description: 'Sed ac tristique mauris. Curabitur id elit sed urna condimentum bibendum.',
  //   },
  //   {
  //     id: 3,
  //     title: 'Booking 3',
  //     description: 'Nullam euismod, libero vel cursus tristique, ipsum lectus pulvinar neque.',
  //   },
  //   {
  //     id: 4,
  //     title: 'Booking 4',
  //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  //   },
  //   {
  //     id: 5,
  //     title: 'Booking 5',
  //     description: 'Sed ac tristique mauris. Curabitur id elit sed urna condimentum bibendum.',
  //   },
  //   {
  //     id: 6,
  //     title: 'Booking 6',
  //     description: 'Nullam euismod, libero vel cursus tristique, ipsum lectus pulvinar neque.',
  //   },
  //   {
  //     id: 7,
  //     title: 'Booking 7',
  //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  //   },
  //   {
  //     id: 8,
  //     title: 'Booking 8',
  //     description: 'Sed ac tristique mauris. Curabitur id elit sed urna condimentum bibendum.',
  //   },
  //   {
  //     id: 9,
  //     title: 'Booking 9',
  //     description: 'Nullam euismod, libero vel cursus tristique, ipsum lectus pulvinar neque.',
  //   },
  //   {
  //     id:10,
  //     title: 'Booking 10',
  //     description: 'Nullam euismod, libero vel cursus tristique, ipsum lectus pulvinar neque.',
  //   },
  // ];
  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <List.Section>
          { bookingData && bookingData.map((booking) => (
            <Card key={booking.id} style={styles.card}>
              <Card.Title title={`Booking Id :  ${booking.booking_id}`} />
              <Card.Content>
                <Paragraph>Group_name : {booking.group_name} </Paragraph>
                <Paragraph>status : {booking.status} </Paragraph>
                <Paragraph>dates : {booking.dates} </Paragraph>
              </Card.Content>
            </Card>
          ))}
          {!bookingData && (<Text> Data not found</Text>) }
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
});

export default connect(mapStateToProps)(BookingRequest);