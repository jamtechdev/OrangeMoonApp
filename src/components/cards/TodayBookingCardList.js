/* eslint-disable prettier/prettier */
import * as React from 'react';
import {ScrollView, StyleSheet, View, Pressable, TouchableOpacity } from 'react-native'; // Import View
import {Avatar, Button, Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {formatDate, formatTime} from '../../utils/_helpers';
import globalStyles from '../../utils/_css/globalStyle';
import {AppStyles} from '../../utils/AppStyles';
import moment from 'moment';

const TodayBookingCardList = ({
  item,
  openActionDialog,
  openPrecheckDialog,
  navigation,
  ArrivedMarked,
}) => {
  const checkActive = item => {
    const currentDateTime = new Date();
    const firstTime = new Date(currentDateTime);
    const secondTime = new Date(
      `${item.booking_day.date}T${item.booking_day.start_time}`,
    );
    const interval = Math.abs(secondTime - firstTime) / 36e5; // Calculate the interval in hours

    let active = false;

    if (interval <= 8 && interval > 1) {
      active = true;
    } else if (interval <= 1 && item.temperature_button === 1) {
      active = true;
    }

    // Assuming getBookingTimeZone is already a valid time zone identifier
    const timeZone =
      item?.booking_day?.booking?.hotel?.state?.time_zone || 'EST';
    const timeOffset = new Date().toLocaleString('en-US', {
      timeZone,
      timeZoneName: 'short',
    });

    const current_date = moment(
      timeOffset.toString().split(',')[0],
      'M/D/YYYY',
    ).format('YYYY-MM-DD');
    return current_date;
  };
  const detailHandler = item => {
    console.log('item', item);
    const data = new Object({
      id: item?.monitor_booking_day_report?.id,
      start_Time: item.booking_day.start_time,
      end_Time: item.booking_day.end_time,
    });
    navigation.navigate('DetailsReport', {Booking: data, header: 'today'});
  };

  return (
    <Card style={styles.tableCard}>
      <Card.Content>
        <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
          <View style={styles.viewRow}>
            <View style={styles.badgeheadingText}>
              <Text style={styles.valueTextinner}>
                Date:  { moment(item?.booking_day?.date).format('MM/DD/YYYY')}
              </Text>
            </View>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {' '}
              {item?.monitor_booking_day_report == null
                ? 'NOT STARTED'
                : 'IN PROGRESS'}
            </Text>
          </View>
        </View>

        <View style={[styles.viewRow, {flexDirection: 'column', gap: 5}]}>
          <Text style={styles.keyText}>Group Name </Text>
          <Text style={styles.valueText}>
            {item?.booking_day?.booking?.group_name}
          </Text>
        </View>
        <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
          <View style={[styles.viewRow, {flexDirection: 'column', gap: 5}]}>
            <Text style={styles.keyText}>Start Time</Text>
            <Text style={styles.valueText}>
              {formatTime(item?.booking_day?.start_time)}
            </Text>
          </View>
          <View
            style={[
              styles.viewRow,
              {
                flexDirection: 'column',
                gap: 5,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              },
            ]}>
            <Text style={styles.keyText}>End Time</Text>
            <Text style={styles.valueText}>
              {formatTime(item?.booking_day?.end_time)}
            </Text>
          </View>
        </View>

        <View style={[globalStyles.buttonRow, {marginTop: 10}]}>
          <View style={styles.action}>
            {!item?.monitor_booking_day_report &&
              item?.booking_day?.date <= checkActive(item) && (
                <Icon
                  name="hospital-o"
                  onPress={() => openActionDialog(item)}
                  size={20}
                  color={AppStyles.color.tint}
                />
              )}
            {item?.monitor_booking_day_report && (
              <>
                {item?.arrival_time !== null && (
                  <Pressable
                    style={styles.badgeButtonDisable}
                    onPress={() => console.log('gsys')}>
                    <Text style={styles.badgeButtonText}>Arrived</Text>
                  </Pressable>
                )}
                {item?.arrival_time == null && (
                  <TouchableOpacity
                    style={styles.badgeButton}
                    onPress={() => ArrivedMarked(item)}>
                    <Text style={styles.badgeButtonText}> Mark Arrived</Text>
                  </TouchableOpacity>
                )}
                <Icon
                  name="eye"
                  onPress={() => detailHandler(item)}
                  size={20}
                  color={AppStyles.color.tint}
                />
              </>
            )}
            {item?.monitor_booking_day_report &&
              item?.precheckCount === 0 &&
              item?.arrival_time !== null && (
                <Icon
                  name="play"
                  onPress={() => openPrecheckDialog(item)}
                  size={20}
                  color={AppStyles.color.tint}
                />
              )}
            {item?.monitor_booking_day_report && item?.precheckCount > 0 && (
              <>
                <Icon
                  name="plus"
                  // onPress={() => openActionDialog(item)}
                  onPress={() => openPrecheckDialog(item, 'plus')}
                  size={20}
                  color={AppStyles.color.tint}
                />
                <Icon
                  name="plus-circle"
                  // onPress={() => openActionDialog(item)}
                  onPress={() => openPrecheckDialog(item, 'plus-circle')}
                  size={20}
                  color={AppStyles.color.tint}
                />
              </>
            )}
            {item?.monitor_booking_day_report &&
              item?.precheckCount > 0 &&
              item.monitor_booking_day_report?.end_time == null && (
                <Icon
                  name="stop"
                  onPress={() => openActionDialog(item, 'stop')}
                  size={20}
                  color={AppStyles.color.tint}
                />
              )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  tableCard: {
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  action: {
    gap: 30,
    flex: 1,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 5,
  },
  keyText: {
    fontWeight: '700',
    color: AppStyles.color.tint,
    // marginRight: 4, // Add some margin for separation
    fontSize: 14,
  },
  valueText: {
    // marginLeft: 8,
    fontSize: 12,
    color: '#000',
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
  },
  badge: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeheadingText: {
    backgroundColor: AppStyles.color.tint,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueTextinner: {
    fontSize: 10,
    color: '#fff',
  },
  badgeButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontSize: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeButtonDisable: {
    backgroundColor: AppStyles.color.tint,
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontSize: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  badgeButtonText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default TodayBookingCardList;
