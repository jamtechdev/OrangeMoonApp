/* eslint-disable prettier/prettier */
import * as React from 'react';
import {ScrollView, StyleSheet, View, Pressable} from 'react-native'; // Import View
import {Avatar, Button, Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createdDate, formatDate, formatTime } from '../../utils/_helpers';
import globalStyles from '../../utils/_css/globalStyle';
import {AppStyles} from '../../utils/AppStyles';
const  IncidentCardList = ({item  }) => (
  <Card style={styles.tableCard}>
    <Card.Content>
      <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={styles.viewRow}>
          <View style={styles.badgeheadingText}>
          <Text style={styles.valueTextinner}>Id : {item?.id}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.viewRow, {flexDirection: 'column', gap: 5}]}>
        <Text style={styles.keyText}>Location </Text>
        <Text style={styles.valueText}>
        {item.location}
        </Text>
      </View>
      <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={styles.viewRow}>
        <View style={{justifyContent:'center'}}>
        <Text style={styles.keyvalueText}>Description : </Text>
        </View>
           <Text style={styles.valueText}>{item?.description}</Text>
        </View>
      </View>
      <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={styles.viewRow}>
        <View style={{justifyContent:'center'}}>
        <Text style={styles.keyvalueText}>Rooms : </Text>
        </View>
           <Text style={styles.valueText}>{item?.rooms}</Text>
        </View>
      </View>
      <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={styles.viewRow}>
        <View style={{justifyContent:'center'}}>
        <Text style={styles.keyvalueText}>Students : </Text>
        </View>
           <Text style={styles.valueText}>{item?.students}</Text>
        </View>
      </View>
      <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={styles.viewRow}>
        <View style={{justifyContent:'center'}}>
        <Text style={styles.keyvalueText}>Witness Description : </Text>
        </View>
           <Text style={styles.valueText}>{item?.witness_description}</Text>
        </View>
      </View>
      <View style={[globalStyles.buttonRow, {alignItems: 'center'}]}>
        <View style={[styles.viewRow, {flexDirection: 'column', gap: 5, justifyContent:'flex-start', alignItems:'flex-start'}]}>
            <Text style={styles.keyText}>Date</Text>
            <View style={styles.badgeheadingText}>
          <Text style={styles.valueTextinner}> {formatDate(item?.created_at)}</Text>
          </View>
          </View>
          <View style={[styles.viewRow, {flexDirection: 'column', gap: 5, justifyContent:'flex-end', alignItems:'flex-end'}]}>
            <Text style={styles.keyText}>Time</Text>
            <View style={styles.badge}>
                <Text style={styles.valueTextinner}> {formatTime(item?.time)}</Text>
          </View>
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
  keyvalueText:{
    fontWeight: '700',
    color: AppStyles.color.tint,
    fontSize: 12,
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

export default IncidentCardList;
