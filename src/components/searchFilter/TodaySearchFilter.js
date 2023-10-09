/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {View, StyleSheet, Pressable} from 'react-native';
import {Avatar,Searchbar, Button, Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppStyles } from '../../utils/AppStyles';
import { useState } from 'react';
import { formatDate, formatTime } from '../../utils/_helpers';

export default function TodayFilterSearch({ dashboardDataBkp, setDashboardData, searchQuery, setSearchQuery, sortDirections, setSortDirections, dashboardData}) {
    const [showFilter, setShowFilter] = useState(false);
    const [activeFilter, setActiveFilter] = useState('')
    const toggleFilter = ()=>setShowFilter(!showFilter);

    const handleSearch = (query) => {
      const lowerCaseQuery = query.toLowerCase();
      const filteredData = dashboardDataBkp.filter((item) =>
        item?.booking_day?.booking?.group_name.toLowerCase().includes(lowerCaseQuery) ||
        formatDate(item?.booking_day?.date).includes(lowerCaseQuery) ||
        formatTime(item?.booking_day?.start_time).includes(lowerCaseQuery) ||
        formatTime(item?.booking_day?.end_time).includes(lowerCaseQuery) ||
        item?.status.toLowerCase().includes(lowerCaseQuery)
      );
      if (filteredData.length !== 0) {
        setDashboardData(filteredData);
      } else {
        setDashboardData(dashboardDataBkp);
      }
      console.log(filteredData, query);
      setSearchQuery(query);
    };

    const handleSort = async (columnKey) => {
      const nextSortDirection =
        sortDirections[columnKey] === 'ascending'
          ? 'descending'
          : 'ascending';
      setSortDirections({
        ...sortDirections,
        [columnKey]: nextSortDirection,
      });
      let sortDataType = '';
      const sortedData = [...dashboardData].sort((a, b) => {
        let aValue = '';
        let bValue = '';
        if (columnKey == 'group_name') {
          sortDataType = typeof dashboardData[0]?.booking_day?.booking?.group_name
          aValue = a?.booking_day?.booking?.group_name;
          bValue = b?.booking_day?.booking?.group_name;
        } else if (columnKey == 'status') {
          sortDataType = typeof dashboardData[0][columnKey]
          aValue = a?.status;
          bValue = b?.status;
        } else {
          sortDataType = typeof dashboardData[0]['booking_day'][columnKey]
          aValue = a?.booking_day[columnKey];
          bValue = b?.booking_day[columnKey];
        }
        switch (sortDataType) {
          case 'number':
            return nextSortDirection === 'ascending' ? aValue - bValue : bValue - aValue;
          case 'string':
            return nextSortDirection === 'ascending' ? aValue?.localeCompare(bValue) : bValue?.localeCompare(aValue);
          case 'object': // Assuming the data type is Date
            return nextSortDirection === 'ascending' ? aValue?.getTime() - bValue?.getTime() : bValue?.getTime() - aValue?.getTime();
          default:
            return 0; // Return 0 for unknown data types or if sortKey is not found
        }
      });
      console.log(sortDirections, columnKey, sortDataType, sortedData)
      setDashboardData(sortedData);
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
            <Button icon={sortDirections.booking_id == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'group' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'group'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('group_name'); setActiveFilter('group')}}>Group</Button>
            <Button icon={sortDirections.booking_id == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'date' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'date'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('date'); setActiveFilter('date')}}>Date</Button>
            <Button icon={sortDirections.booking_id == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'status' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'status'? styles.filterButtonActive  :styles.filterButton } onPress={() =>{ handleSort('status'); setActiveFilter('status')}}>status</Button>
            <Button icon={sortDirections.booking_id == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'start_time' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'start_time'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('start_time'); setActiveFilter('start_time')}}>Start Time</Button>
            <Button icon={sortDirections.booking_id == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'end_time' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'end_time'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('end_time'); setActiveFilter('end_time')}}>End Time</Button>
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
