/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {View, StyleSheet, Pressable} from 'react-native';
import {Avatar,Searchbar, Button, Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppStyles } from '../../utils/AppStyles';
import { useState } from 'react';
import { formatDate, formatTime } from '../../utils/_helpers';

export default function CompleteFilterSearch({ completeData,setCompleteData, completeDataBkp}) {
    const [showFilter, setShowFilter] = useState(false);
    const [activeFilter, setActiveFilter] = useState('')
    const toggleFilter = ()=>setShowFilter(!showFilter);
    const [sortDirections, setSortDirections] = useState({
      id: 'none', // Initialize with 'none' as the default
      group_name: 'none',
      start_date: 'none',
      end_date: 'none',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const handleSort = async (columnKey) => {
      const nextSortDirection =
        sortDirections[columnKey] === 'ascending'
          ? 'descending'
          : 'ascending';
      setSortDirections({
        ...sortDirections,
        [columnKey]: nextSortDirection,
      });
      // const value = await sortingHelper(completeData, columnKey, nextSortDirection)
      let sortDataType = typeof completeData[0]['booking'][columnKey];
      const sortedData = [...completeData].sort((a, b) => {
        let aValue = a['booking'][columnKey];
        let bValue = b['booking'][columnKey];
        if (columnKey == 'id') {
          aValue = a[columnKey];
          bValue = b[columnKey];
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
      setCompleteData(sortedData);
    };
    const handleSearch = (query) => {
      const lowerCaseQuery = query.toLowerCase();
      const filteredData = completeData.filter((item) =>
        item?.id?.toString()?.toLowerCase()?.includes(lowerCaseQuery) ||
        item?.booking?.group_name?.toLowerCase()?.includes(lowerCaseQuery) ||
        formatDate(item?.booking?.start_date)?.toLowerCase()?.includes(lowerCaseQuery) ||
        formatDate(item?.booking?.end_date)?.toLowerCase()?.includes(lowerCaseQuery)
      );
      if (filteredData.length == 0 || query == '') {
        setCompleteData(completeDataBkp)
      } else {
        setCompleteData(filteredData)
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
        <Button icon={sortDirections.id == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'} mode="contained-tonal" buttonColor={ activeFilter == 'id' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'id'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('id'); setActiveFilter('id')} }>Id</Button>
            <Button icon={sortDirections.group_name == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'group' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'group'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('group_name'); setActiveFilter('group')}}>Group Name</Button>
            <Button icon={sortDirections.start_date == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'date' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'date'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('start_date'); setActiveFilter('date')}}>Start Date</Button>
            <Button icon={sortDirections.end_date == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'status' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'status'? styles.filterButtonActive  :styles.filterButton } onPress={() =>{ handleSort('end_date'); setActiveFilter('status')}}>End Date</Button>
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
