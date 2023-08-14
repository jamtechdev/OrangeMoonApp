/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState , useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { List, Card, Avatar, Title, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import { AppStyles, AppIcon } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';
import { monitorService } from '../utils/_services';
import { routeValue } from '../redux/actions/authActions';
function BookingRequest({ navigation, user , token, route}) {
  const [bookingData, setBookingData] = useState()
  useEffect(()=>{
    monitorService.bookingRequest(token).then(res=>{
      console.log(res,"here my console res");
      setBookingData(res?.data?.data)
    }).catch(error=>console.log(error))
  },[])

  const navigateDetails =(booking)=>{
    route(booking?.id);
    navigation.navigate({
      name: 'BookingDetails',
      params: { bookingId: booking.id },
    });

  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <List.Section>
          { bookingData && bookingData?.map((booking) => (
            <Card key={booking.id} style={styles.card} onPress={()=>navigateDetails(booking)}>
              <Card.Title title={`Request Id :  ${booking.booking_id}`} />
              <Card.Content>
                <Paragraph>Group Name : {booking.group_name} </Paragraph>
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
const mapDispatchToProps = (dispatch) => ({
  route: (id) =>{ dispatch(routeValue(id)), console.log(id, 'ghere')},
});
export default connect(mapStateToProps, mapDispatchToProps)(BookingRequest);