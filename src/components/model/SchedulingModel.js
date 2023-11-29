/* eslint-disable prettier/prettier */
import React, {useLayoutEffect, useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Text, Pressable} from 'react-native';
import {
  List,
  Card,
  ActivityIndicator,
  Button,
  Divider,
  Snackbar,
  DataTable,
  Portal,
  Modal,
  Dialog,
} from 'react-native-paper';
import globalStyles from '../../utils/_css/globalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AppStyles} from '../../utils/AppStyles';
import {formatDate, isWithin48Hours} from '../../utils/_helpers';
import moment from 'moment';
const SchedulingModel = ({
  visibleModel,
  hideModal,
  bookingDetails,
  modelType,
  showConfirmFunction,
}) => {
  const date = moment(new moment().add(2, 'day')).format('DD');
  const month = moment(new moment().add(2, 'day')).format('MM');
  const [selectedDate, setSelectedDate] = useState(

  );
  const [selectedMonth, setselectedMonth] = useState(
    );

  useEffect(() => {
    if(bookingDetails){
      bookingDetails?.monitor_booking_day_requests?.length > 0 && moment(
        setSelectedDate(new moment(
        bookingDetails?.monitor_booking_day_requests[0]?.booking_day?.date,
      )
    .format('DD')))
    ,
 bookingDetails?.monitor_booking_day_requests?.length > 0 &&   moment(
      setselectedMonth(new moment(
        bookingDetails?.monitor_booking_day_requests[0]?.booking_day?.date,
      )
    .format('MM')))
      }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  } , [visibleModel , bookingDetails])



console.log(bookingDetails?.monitor_booking_day_requests && bookingDetails?.monitor_booking_day_requests.length > 0 && bookingDetails?.monitor_booking_day_requests[0].booking_day?.date , 'divyanshu');

  return (
    <Portal>
      <Modal
        visible={visibleModel}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalView}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.rowView}>
              <Text style={globalStyles.subtitle}>Reservation Details</Text>
              <Icon
                color={AppStyles.color?.tint}
                style={[globalStyles.rightImageIcon, styles.closeIcon]}
                name="close"
                size={20}
                onPress={hideModal}
              />
            </View>
            <Divider style={globalStyles.divider} />
            <View style={styles.accountDetailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Group Name :</Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.group_name || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Number Of Students:</Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.no_of_student || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Floor: </Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.no_of_floor || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>TD/GL Name: </Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.gl_name || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>TD/GL Contact No: </Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.gl_contact_no || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Start Date: </Text>
                <Text style={styles.valueText}>
                  {/* {bookingDetails?.booking?.monitor_booking_day_requests[0]?.booking_day.date || '-'}{' '} */}
                  {bookingDetails?.monitor_booking_day_requests && bookingDetails?.monitor_booking_day_requests.length > 0 && formatDate(bookingDetails?.monitor_booking_day_requests[0].booking_day?.date) || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>End Date:</Text>
                <Text style={styles.valueText}>
                {bookingDetails?.monitor_booking_day_requests && bookingDetails?.monitor_booking_day_requests.length > 0 && formatDate(bookingDetails?.monitor_booking_day_requests[bookingDetails?.monitor_booking_day_requests.length  -1].booking_day?.date) || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Start Time: </Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.start_time || '-'}{' '}
                </Text>
              </View>

              
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>End Time: </Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.end_time || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Hotel Name:</Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.hotel?.name || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Hotel Address: </Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.hotel?.address || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Hotel Phone:</Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.hotel?.phone || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Hotel State:</Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.hotel?.state.state_name || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Hotel City:</Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.hotel?.city?.city_name || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Hotel Zipcode:</Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.hotel?.zip_code || '-'}{' '}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.keyText}>Location:</Text>
                <Text style={styles.valueText}>
                  {bookingDetails?.booking?.location?.name || '-'}{' '}
                </Text>
              </View>
            </View>
            <Divider style={globalStyles.divider} />
            {modelType == 'OFFERED' && (
              <View style={globalStyles.buttonRow}>
                <Button
                  onPress={() => {
                    showConfirmFunction(1);
                  }}>
                  {' '}
                  Accept
                </Button>
                <Button
                  onPress={() => {
                    showConfirmFunction(2);
                  }}>
                  {' '}
                  Reject{' '}
                </Button>
              </View>
            )}
            {modelType == 'BOOKED' && (
              <>
                {(-parseInt(date) + parseInt(selectedDate)) <= 2 && selectedMonth <= month? (
                  <Button> Late Cancel </Button>
                ) : (
                  <Button
                    onPress={() => {
                      showConfirmFunction(3);
                    }}>
                    Cancel
                  </Button>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 2,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  card: {
    marginBottom: 16,
  },
  DataTable: {
    marginTop: 20,
  },
  header: {
    paddingHorizontal: 6,
    backgroundColor: AppStyles.color.background,
    borderBottomWidth: 1,
    color: AppStyles.color.white,
  },
  headerCell: {
    width: 200,
    height: 50,
  },
  cell: {
    width: 200,
    height: 55,
  },
  iconCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
  iconGap: {
    width: 20,
  },
  hederGap: {
    width: 20,
  },
  nextDiv: {
    marginVertical: 15,
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  todayButton: {
    color: AppStyles.color?.tint,
    fontWeight: '700',
  },
  monthText: {
    textAlign: 'center',
    color: AppStyles.color?.black,
    fontWeight: '700',
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateIcon: {
    marginHorizontal: 15,
  },
  customEventContainer: {
    borderRadius: 5,
    padding: 8,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventText: {
    color: AppStyles.color.white,
    fontSize: 8,
    fontWeight: '600',
  },
  input: {
    marginTop: 15,
  },
  buttonStyle: {
    paddingHorizontal: 15,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountDetailsContainer: {
    marginTop: 10,
  },
  modalView: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    // paddingVertical:5,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
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
    fontSize: 12,
  },
  valueText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
  },
  closeIcon: {
    right: 0,
    top: 15,
  },
  tableAddress: {
    flex: 3,
    width: 300,
  },
  tableAction: {
    flex: 2,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    color: AppStyles.color.white,
    backgroundColor: AppStyles.color.tint,
    fontSize: 8,
  },
});

export default SchedulingModel;
