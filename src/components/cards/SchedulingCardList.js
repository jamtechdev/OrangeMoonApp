/* eslint-disable prettier/prettier */
import * as React from 'react';
import {ScrollView, StyleSheet, View, Pressable} from 'react-native'; // Import View
import {Avatar, Button, Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createdDate, formatTime, formatDate } from '../../utils/_helpers';
import globalStyles from '../../utils/_css/globalStyle';
import {AppStyles} from '../../utils/AppStyles';
const SchedulingCardList = ({item , updateRequestStatus }) => (
  <Card style={styles.tableCard}>
    <Card.Content>
    <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={styles.viewRow}>
          <View style={styles.badgeheadingText}>
          <Text style={styles.valueTextinner}>Id: {item.booking_id}</Text>
          </View>
        </View>
        <View style={styles.badgeheadingText}>
        <Text style={styles.valueTextinner}> Job Date : {formatDate(item?.date)}</Text>
          </View>
      </View>
      <View style={[styles.viewRow, {flexDirection: 'column', gap: 5}]}>
        <Text style={styles.keyText}>Group Name</Text>
        <Text style={styles.valueText}>
        {item?.group_name}
        </Text>
      </View>
      <View style={[styles.viewRow, {flexDirection: 'column', gap: 5}]}>
        <Text style={styles.keyText}>Hotel Address</Text>
        <Text style={styles.valueText}>
        {item?.location}
        </Text>
      </View>
      <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={[styles.viewRow, {flexDirection: 'column', gap: 5}]}>
            <Text style={styles.keyText}>Start Time</Text>
              <Text style={styles.valueText}>
              {formatTime(item?.start_time)}
              </Text>
          </View>
          <View style={[styles.viewRow, {flexDirection: 'column', gap: 5, justifyContent:'flex-end', alignItems:'flex-end'}]}>
            <Text style={styles.keyText}>End Time</Text>
              <Text style={styles.valueText}>
              {formatTime(item?.end_time)}
              </Text>
          </View>
          <View style={[styles.action, ]}>
          <Pressable style={styles.badgeButton} onPress={() => updateRequestStatus(item?.booking_day_id)}>
                 <Text style={styles.badgeButtonText}> Request</Text>
          </Pressable>

        </View>
        </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  tableCard: {
    marginVertical:5,
    marginHorizontal:5,
    backgroundColor: '#fff',
  },
  action: {
    gap: 10,
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
    fontSize: 13,
  },
  valueText: {
    // marginLeft: 8,
    fontSize: 11,
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
  badgeButton:{
    backgroundColor: 'green',
    paddingVertical: 9,
    paddingHorizontal: 18,
    fontSize:15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeButtonText: {
    fontSize: 14,
    color: '#fff',
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
  button:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppStyles.color.tint,
    width: '100%',
  }
});

export default SchedulingCardList;
