/* eslint-disable prettier/prettier */
import * as React from 'react';
import {ScrollView, StyleSheet, View, Pressable} from 'react-native'; // Import View
import {Avatar, Button, Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { formatDate } from '../../utils/_helpers';
import globalStyles from '../../utils/_css/globalStyle';
import {AppStyles} from '../../utils/AppStyles';
const CompleteCardList = ({item , navigateDetails }) => (
  <Card style={styles.tableCard}>
    <Card.Content>
      <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={styles.viewRow}>
          <View style={styles.badgeheadingText}>
            <Text style={styles.valueTextinner}>Id: {item.id}</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Start Date : {formatDate(item.booking.start_date)}</Text>
        </View>
      </View>

      <View style={[styles.viewRow, {flexDirection: 'column', gap: 5}]}>
        <Text style={styles.keyText}>Group Name </Text>
        <Text style={styles.valueText}>
        {item.booking.group_name}
        </Text>
      </View>
      <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={styles.viewRow}>
          <View style={styles.badgeheadingText}>
            <Text style={styles.valueTextinner}>End Date:   {formatDate(item.booking.start_date)}</Text>
          </View>
        </View>
        <View style={styles.action}>
          <Pressable style={styles.pressable} onPress={() => navigateDetails(item)}>
          <Icon name="eye" color={AppStyles.color.tint} size={20}   />
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
});

export default CompleteCardList;
