/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {View, StyleSheet, Pressable} from 'react-native';
import {Avatar,Searchbar, Button, Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppStyles } from '../../utils/AppStyles';
import { useState } from 'react';
import { formatDate, sortingHelper } from '../../utils/_helpers';

export default function FilterSearch({ bookingDataBkp, setBookingData, bookingData}) {
    const [showFilter, setShowFilter] = useState(false);
    const [activeFilter, setActiveFilter] = useState('')
    const toggleFilter = ()=>setShowFilter(!showFilter);
    const [sortDirections, setSortDirections] = useState({
      booking_id: 'none', // Initialize with 'none' as the default
      group_name: 'none',
      dates: 'none',
      status: 'none',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearch = query => {
      const lowerCaseQuery = query.toLowerCase();
      const filteredData = bookingDataBkp.filter(
        item =>
          item?.booking_id?.toString()?.toLowerCase()?.includes(lowerCaseQuery) ||
          item?.group_name?.toLowerCase()?.includes(lowerCaseQuery) ||
          formatDate(item?.dates)?.toLowerCase()?.includes(lowerCaseQuery) ||
          item?.status?.toLowerCase()?.includes(lowerCaseQuery),
      );
      if (filteredData.length == 0 || query == '') {
        setBookingData(bookingDataBkp);
      } else {
        setBookingData(filteredData);
      }
      setSearchQuery(query);
    };

    const handleSort = async columnKey => {
      const nextSortDirection =
        sortDirections[columnKey] === 'ascending' ? 'descending' : 'ascending';
      setSortDirections({
        ...sortDirections,
        [columnKey]: nextSortDirection,
      });
      const value = await sortingHelper(
        bookingData,
        columnKey,
        nextSortDirection,
      );
      console.log(value);
      setBookingData(value);
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
            <Button icon={sortDirections.group_name == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'group' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'group'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('group_name'); setActiveFilter('group')}}>Group</Button>
            <Button icon={sortDirections.dates == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'date' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'date'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('dates'); setActiveFilter('date')}}>Date</Button>
            <Button icon={sortDirections.status == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'status' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'status'? styles.filterButtonActive  :styles.filterButton } onPress={() =>{ handleSort('status'); setActiveFilter('status')}}>status</Button>
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
