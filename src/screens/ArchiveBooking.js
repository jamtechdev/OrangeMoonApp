/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { List, Searchbar, Divider, Chip, Paragraph, DataTable } from 'react-native-paper';
import { connect } from 'react-redux';
import { monitorService } from '../utils/_services';
import { AppStyles } from '../utils/AppStyles';
import globalStyles from '../utils/_css/globalStyle';
import { formatDate, sortingHelper } from '../utils/_helpers';
import LoadingContainer from '../components/LoadingContainer';

function ArchiveBooking({ navigation, user, token, route }) {
  const [archiveData, setArchiveData] = useState([])
  const [archiveDataBkp, setArchiveDataBkp] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [sortDirections, setSortDirections] = useState({
    id: 'none', // Initialize with 'none' as the default
    group_name: 'none',
    start_date: 'none',
    end_date: 'none',
    status: 'none',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, archiveData?.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    monitorService.archivesBooking(token).then(res => {
      console.log(res, "here my console res");
      setArchiveData(res?.data?.data);
      setArchiveDataBkp(res?.data?.data);
      setIsLoading(false);
    }).catch(error => {
      console.log(error);
      setIsLoading(false);
    })
  }, [token])

  const handleSort = async (columnKey) => {
    const nextSortDirection =
      sortDirections[columnKey] === 'ascending'
        ? 'descending'
        : 'ascending';
    setSortDirections({
      ...sortDirections,
      [columnKey]: nextSortDirection,
    });

    let sortDataType = typeof archiveData[0][columnKey];
    const sortedData = [...archiveData].sort((a, b) => {
      let aValue = a[columnKey];
      let bValue = b[columnKey];
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
    setArchiveData(sortedData);
  };
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredData = archiveData.filter((item) =>
      item?.id?.toString()?.toLowerCase()?.includes(lowerCaseQuery) ||
      item?.booking?.group_name?.toLowerCase()?.includes(lowerCaseQuery) ||
      formatDate(item?.booking?.start_date)?.toLowerCase()?.includes(lowerCaseQuery) ||
      formatDate(item?.booking?.end_date)?.toLowerCase()?.includes(lowerCaseQuery)
    );
    if (filteredData.length == 0 || query == '') {
      setArchiveData(archiveDataBkp)
    } else {
      setArchiveData(filteredData)
    }
    setSearchQuery(query);
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={globalStyles.subtitle}> Archiving Bookings</Text>
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
              <DataTable.Title style={globalStyles.tableCellId} sortDirection={sortDirections.id} onPress={() => handleSort('id')}>
                ID
              </DataTable.Title>
              <DataTable.Title style={globalStyles.tableCellGroup} sortDirection={sortDirections.group_name} onPress={() => handleSort('group_name')} >
                Group Name
              </DataTable.Title>
              <DataTable.Title style={globalStyles.tableCell} sortDirection={sortDirections.start_date} onPress={() => handleSort('start_date')}>
                Start Date
              </DataTable.Title>
              <DataTable.Title style={globalStyles.tableCell} sortDirection={sortDirections.end_date} onPress={() => handleSort('end_date')}>
                End Date
              </DataTable.Title>
              <DataTable.Title style={globalStyles.tableCell} sortDirection={sortDirections.status} onPress={() => handleSort('status')}>
                Status
              </DataTable.Title>
            </DataTable.Header>
            {isLoading && <LoadingContainer />}
            {archiveData?.slice(from, to).map((item) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell style={globalStyles.tableCellId}>{item.id}</DataTable.Cell>
                <DataTable.Cell style={globalStyles.tableCellGroup}>{item.booking.group_name}</DataTable.Cell>
                <DataTable.Cell style={globalStyles.tableCell}>{formatDate(item.booking.start_date)}</DataTable.Cell>
                <DataTable.Cell style={globalStyles.tableCell}>{formatDate(item.booking.end_date)}</DataTable.Cell>
                <DataTable.Cell style={globalStyles.tableCell}>
                  <Chip>{item?.status}</Chip>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            {!archiveData?.length && !isLoading && (
              <Text style={globalStyles.emptyData}>Data not found</Text>
            )}
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(archiveData.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${archiveData.length}`}
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

export default connect(mapStateToProps)(ArchiveBooking)