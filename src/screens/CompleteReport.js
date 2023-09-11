/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Portal, Dialog, Button, Text, DataTable, Divider, Searchbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { monitorService } from '../utils/_services';
import { routeValue } from '../redux/actions/authActions';
import { formatDate, sortingHelper } from '../utils/_helpers';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingContainer from '../components/LoadingContainer';
import globalStyles from '../utils/_css/globalStyle';

function CompleteReport({ navigation, user, token, route }) {
  const [completeData, setCompleteData] = useState([])
  const [completeDataBkp, setCompleteDataBkp] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [sortDirections, setSortDirections] = useState({
    id: 'none', // Initialize with 'none' as the default
    group_name: 'none',
    start_date: 'none',
    end_date: 'none',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, completeData?.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    monitorService.completedReport(token).then(res => {
      setCompleteData(res?.data?.data);
      setCompleteDataBkp(res?.data?.data);
      setIsLoading(false);
    }).catch(error => {
      console.log(error);
      setIsLoading(false);
    })
  }, [token])

  const navigateDetails = (booking) => {
    route(booking);
    navigation.navigate({
      name: 'SubReport',
      params: { bookingId: booking },
    });
    console.log(booking, 'here my route ')
  }

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
    <ScrollView style={styles.container} scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 0 }}>
      <View style={styles.container}>
        <Text style={globalStyles.subtitle}> Reports</Text>
        <Divider style={globalStyles.divider} />
        <Searchbar
          placeholder="Search"
          style={styles.Searchbar}
          onChangeText={handleSearch}
          value={searchQuery}
        />
        <ScrollView horizontal >
          <DataTable style={globalStyles.DataTable}>
            <DataTable.Header style={globalStyles.header}>
              <DataTable.Title
                sortDirection={sortDirections.id}
                onPress={() => handleSort('id')}
                style={globalStyles.tableCellId}
              >
                ID
              </DataTable.Title>
              <DataTable.Title
                sortDirection={sortDirections.group_name}
                onPress={() => handleSort('group_name')}
                style={globalStyles.tableCellGroup}
              >
                Group Name
              </DataTable.Title>
              <DataTable.Title
                sortDirection={sortDirections.start_date}
                onPress={() => handleSort('start_date')}
                style={globalStyles.tableCell}
              >
                Start Date
              </DataTable.Title>
              <DataTable.Title
                sortDirection={sortDirections.end_date}
                onPress={() => handleSort('end_date')}
                style={globalStyles.tableCell}
              >
                End Date
              </DataTable.Title>
              <DataTable.Title style={globalStyles.tableSingleAction}>Action</DataTable.Title>
            </DataTable.Header>
            {completeData?.slice(from, to).map((item) => (
              <DataTable.Row key={item.id} onPress={() => navigateDetails(item)}>
                <DataTable.Cell style={globalStyles.tableCellId}>{item.id}</DataTable.Cell>
                <DataTable.Cell style={globalStyles.tableCellGroup}>{item.booking.group_name}</DataTable.Cell>
                <DataTable.Cell style={globalStyles.tableCell}>{formatDate(item.booking.start_date)}</DataTable.Cell>
                <DataTable.Cell style={globalStyles.tableCell}>{formatDate(item.booking.end_date)}</DataTable.Cell>
                <DataTable.Cell style={globalStyles.tableSingleAction}>
                  <Icon name='eye' size={20} color={AppStyles.color.tint} style={globalStyles.icon} />
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            {!completeData?.length && !isLoading && (
              <Text style={globalStyles.emptyData}>Data not found</Text>
            )}
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(completeData.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${completeData.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
        </ScrollView>
      </View>
    </ScrollView>
    {isLoading && 
      <Portal>
        <LoadingContainer />
      </Portal>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 2,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  card: {
    marginBottom: 16,
  },
  DataTable: {
    marginTop: 20,
  },
  header: {
    paddingHorizontal: 6,
    backgroundColor: AppStyles.color.background,
    borderBottomWidth: 1,
    color: AppStyles.color.white,
  },
  headerCell: {
    width: 200,
    height: 50,
  },
  cell: {
    width: 200,
    height: 55
  },
  iconCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10, // Adjust the margin between each icon
  },
  iconGap: {
    width: 20, // Adjust the gap width as needed
  },
  hederGap: {
    width: 20,
  },
  Searchbar: {
    marginTop: 10,
  }

});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
});
const mapDispatchToProps = (dispatch) => ({
  route: (id) => { dispatch(routeValue(id)), console.log(id, 'ghere') },
});
export default connect(mapStateToProps, mapDispatchToProps)(CompleteReport);