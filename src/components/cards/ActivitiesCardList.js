/* eslint-disable prettier/prettier */
import * as React from 'react';
import {ScrollView, StyleSheet, View, Pressable} from 'react-native'; // Import View
import {Avatar, Button, Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createdDate, formatTime } from '../../utils/_helpers';
import globalStyles from '../../utils/_css/globalStyle';
import {AppStyles} from '../../utils/AppStyles';
import moment from 'moment';

const  ActivitiesCardList = ({item  }) =>{ 
  // console.log(item.created_at, "create time ")
  return(
  <Card style={styles.tableCard}>
    <Card.Content>
      <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={styles.viewRow}>
          <View style={styles.badgeheadingText}>
          <Text style={styles.valueTextinner}>Start Time : {formatTime(item?.start_time)}</Text>
          </View>
        </View>
        <View style={styles.badge}>
        <Text style={styles.valueTextinner}>End Time: {formatTime(item?.end_time)}</Text>
          </View>
      </View>
      <View style={[styles.viewRow, {flexDirection: 'column', gap: 5}]}>
        <Text style={styles.keyText}>Current Location </Text>
        <Text style={styles.valueText}>
        {item.current_address}
        </Text>
      </View>
      <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={styles.viewRow}>
          <View style={styles.badgeheadingText}>
          <Text style={styles.valueTextinner}>	Created At : {moment.utc(item?.created_at).local().format('MM/DD/YYYY HH:mm:ss')}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.viewRow, {flexDirection: 'column', gap: 5}]}>
        <Text style={styles.keyText}>Description : </Text>
        <Text style={styles.valueText}>
        {item.description}
        </Text>
      </View>
    </Card.Content>
  </Card>
)};

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
});

export default ActivitiesCardList;
