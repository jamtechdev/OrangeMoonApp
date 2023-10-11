/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {View, StyleSheet, Pressable} from 'react-native';
import {Avatar,Searchbar, Button, Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppStyles } from '../../utils/AppStyles';
import { useState } from 'react';
import { createdDate } from '../../utils/_helpers';

export default function StripeFilterSearch({ stripeTableData, setStripeTableData, stripeTableDataBkp}) {
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('')
  const toggleFilter = ()=>setShowFilter(!showFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirections, setSortDirections] = useState({
    transfer_id: 'none',
    transfer_account_id: 'none',
    amount: 'none',
    created_at: 'none',
  });

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
    const sortedData = [...stripeTableData].sort((a, b) => {
      let aValue = a?.[columnKey];
      let bValue = b?.[columnKey];

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
    setStripeTableData(sortedData);
  };
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredData = stripeTableData.filter((item) =>
      item?.amount?.toString()?.toLowerCase()?.includes(lowerCaseQuery) ||
      item?.transfer_account_id?.toLowerCase()?.includes(lowerCaseQuery) ||
      createdDate(item?.created_at)?.toLowerCase()?.includes(lowerCaseQuery) ||
      item?.transfer_id?.toLowerCase()?.includes(lowerCaseQuery)
    );
    if (filteredData.length == 0 || query == '') {
      setStripeTableData(stripeTableDataBkp)
    } else {
      setStripeTableData(filteredData)
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
          <Button icon={sortDirections.transfer_id == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'} mode="contained-tonal" buttonColor={ activeFilter == 'id' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'id'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('transfer_id'); setActiveFilter('id')} }>Account Id</Button>
          <Button icon={sortDirections.transfer_account_id == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'group' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'group'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('transfer_account_id'); setActiveFilter('group')}}>Transfer ID</Button>
          <Button icon={sortDirections.amount == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'date' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'date'? styles.filterButtonActive  :styles.filterButton }  onPress={() =>{ handleSort('amount'); setActiveFilter('date')}}>Amount</Button>
          <Button icon={sortDirections.created_at == 'ascending' ? 'arrow-up-thick' : 'arrow-down-thick'}  mode="contained-tonal" buttonColor={ activeFilter == 'status' ? AppStyles.color.tint : '' } contentStyle={styles.buttonContainer} labelStyle={activeFilter == 'status'? styles.filterButtonActive  :styles.filterButton } onPress={() =>{ handleSort('created_at'); setActiveFilter('status')}}>Created</Button>
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
