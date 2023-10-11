/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {View, StyleSheet, Pressable} from 'react-native';
import {Avatar,Searchbar, Button, Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppStyles } from '../../utils/AppStyles';
import { useState } from 'react';
import { createdDate, formatDate,formatTime } from '../../utils/_helpers';

export default function SchedulingFilterSearch({ assignableData, setAssignableData, assignableDataBkp}) {
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('')
  const toggleFilter = ()=>setShowFilter(!showFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirections, setSortDirections] = useState({
    booking_id: 'none', // Initialize with 'none' as the default
    group_name: 'none',
    location: 'none',
    date: 'none',
    start_time: 'none',
    end_time: 'none',
  });

  const handleSort = async columnKey => {
    const nextSortDirection =
      sortDirections[columnKey] === 'ascending' ? 'descending' : 'ascending';
    setSortDirections({
      ...sortDirections,
      [columnKey]: nextSortDirection,
    });

    let sortDataType = typeof assignableData[0][columnKey];
    const sortedData = [...assignableData].sort((a, b) => {
      let aValue = a[columnKey];
      let bValue = b[columnKey];
      switch (sortDataType) {
        case 'number':
          return nextSortDirection === 'ascending'
            ? aValue - bValue
            : bValue - aValue;
        case 'string':
          return nextSortDirection === 'ascending'
            ? aValue?.localeCompare(bValue)
            : bValue?.localeCompare(aValue);
        case 'object':
          return nextSortDirection === 'ascending'
            ? aValue?.getTime() - bValue?.getTime()
            : bValue?.getTime() - aValue?.getTime();
        default:
          return 0;
      }
    });
    setAssignableData(sortedData);
  };
  

  const handleSearch = query => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredData = assignableData.filter(
      item =>
        item?.booking_id?.toString()?.toLowerCase()?.includes(lowerCaseQuery) ||
        item?.group_name?.toLowerCase()?.includes(lowerCaseQuery) ||
        item?.location?.toLowerCase()?.includes(lowerCaseQuery) ||
        formatDate(item?.date)?.toLowerCase()?.includes(lowerCaseQuery) ||
        formatTime(item?.start_time)?.toLowerCase()?.includes(lowerCaseQuery) ||
        formatTime(item?.end_time)?.toLowerCase()?.includes(lowerCaseQuery),
    );
    if (filteredData.length == 0 || query == '') {
      setAssignableData(assignableDataBkp);
    } else {
      setAssignableData(filteredData);
    }
    setSearchQuery(query);
  };


return (
  <>
  <View style={styles.box}>
    <Searchbar
      onChangeText={handleSearch}
      value={searchQuery}
      style={styles.searchBox}
      inputStyle={styles.searchText}
    />
    <Pressable style={styles.pressable} onPress={()=>toggleFilter()}>
      <Icon name="filter" color={AppStyles.color.tint} size={20} />
    </Pressable>
  </View>
  {
      showFilter && (
          <View >
      <Text>Filter By</Text>
      <View style={styles.buttonGroup}>
          <Button icon={sortDirections.booking_id == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'} mode="contained-tonal" buttonColor={ activeFilter == 'id' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'id'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('booking_id'); setActiveFilter('id')} }>Id</Button>
          <Button icon={sortDirections.group_name == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'group' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'group'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('group_name'); setActiveFilter('group')}}>Group Name </Button>
          <Button icon={sortDirections.location == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'location' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'location'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('location'); setActiveFilter('location')}}>location</Button>
          <Button icon={sortDirections.date == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'date' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'date'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('date'); setActiveFilter('date')}}>Job Date</Button>
          <Button icon={sortDirections.start_time == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'start_time' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'start_time'? styles.filterButtonActive  :styles.filterButton } onPress={() =>{ handleSort('start_time'); setActiveFilter('start_time')}}>Start Time</Button>
          <Button icon={sortDirections.end_time == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'end_time' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'end_time'? styles.filterButtonActive  :styles.filterButton } onPress={() =>{ handleSort('end_time'); setActiveFilter('end_time')}}>End Time</Button>
      </View>
  </View>
      )
  }

  </>
);
}

const styles = StyleSheet.create({
box: {
  flex: 1,
  flexDirection: 'row',
  alignItems:'center',
  gap:10,
  marginVertical:10,
},
searchBox: {
  backgroundColor: '#f5f5f5',
  flex:1,
  paddingVertical:0,
  height: 45,
},
searchText:{
  lineHeight: 12,
},
pressable:{
  width:50,
  height:45,
  alignItems:'center',
  justifyContent:'center',
  borderRadius:50,
  backgroundColor:'#eee',
  color:AppStyles.color.tint,
},
buttonGroup:{
  flex: 1,
  flexDirection: 'row',
  alignItems:'center',
  justifyContent:'space-between',
  gap:5,
  marginVertical:10,
  flexWrap:'wrap'
},
filterButton:{
  fontSize:10,
  lineHeight: 10,
},
filterButtonActive:{
  fontSize:10,
  color: '#fff',
  lineHeight: 10,
},
buttonContainer:{
  height : 30,
}
});
