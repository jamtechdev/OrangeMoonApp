/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { List, Card, TextInput, Title, Paragraph, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import InputLabelView from '../components/InputLabelView';
import { monitorService } from '../utils/_services';
import LoadingContainer from '../components/LoadingContainer';
function BookingDetails({ navigation, route, user, value, token }) {
  const [bookingDetails, setBookingDetails] = useState()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    monitorService.bookingDetails(token, value).then(res => {
      setBookingDetails(res?.data?.data)
      setIsLoading(false)
    }).catch(error => { setIsLoading(false); console.log(error); })
  }, [value])
  return (
    <>
   {isLoading && 
      <Portal>
        <LoadingContainer />
      </Portal>
      }
      {!isLoading && bookingDetails && (
        <ScrollView style={styles.container}>
          <View style={styles.container}>
            <List.Section>
              {bookingDetails && (
                <Card style={styles.card}>
                  <Card.Title  titleVariant='titleMedium' title='Reservation Details' />
                  <Card.Content>
                    <View style={styles.detailsContainer}>
                      <InputLabelView label="Group Name" value={bookingDetails?.booking?.group_name} multiline={true}/>
                      <InputLabelView label="Number Of Students" value={bookingDetails?.booking?.no_of_student.toString()} />
                      <InputLabelView label="Floor" value={bookingDetails?.booking?.no_of_floor.toString()} />
                      <InputLabelView label="TD/GL Name" value={bookingDetails?.booking?.gl_name} />
                      <InputLabelView label="TD/GL Contact No" value={bookingDetails?.booking?.gl_contact_no} />
                      <InputLabelView label="Start Date" value={bookingDetails?.booking?.start_date} />
                      <InputLabelView label="End Date" value={bookingDetails?.booking?.end_date} />
                      <InputLabelView label="Start Time" value={bookingDetails?.booking?.start_time} />
                      <InputLabelView label="End Time" value={bookingDetails?.booking?.end_time} />
                      <InputLabelView label="Hotel Name" value={bookingDetails?.booking?.hotel?.name} multiline={true}/>
                      <InputLabelView label="Hotel Address" value={bookingDetails?.booking?.hotel?.address} multiline={true}/>
                      <InputLabelView label="Hotel State" value={bookingDetails?.booking?.hotel?.state?.state_name} />
                      <InputLabelView label="Hotel City" value={bookingDetails?.booking?.hotel?.city?.city_name} />
                      <InputLabelView label="Hotel Zipcode" value={bookingDetails?.booking?.hotel?.zip_code} />
                      <InputLabelView label="Hotel Location" value={bookingDetails?.booking?.location?.name} multiline={true}/>
                    </View>
                  </Card.Content>
                </Card>
              )}
              {!bookingDetails && (<Text> Data not found</Text>)}
            </List.Section>
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

export default connect(mapStateToProps)(BookingDetails);