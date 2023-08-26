/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Portal, Dialog, Button, Text, DataTable, Divider, Searchbar, } from 'react-native-paper';
import { connect } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { monitorService } from '../utils/_services';
import { routeValue } from '../redux/actions/authActions';
import { formatDate, sortingHelper } from '../utils/_helpers';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingContainer from '../components/LoadingContainer';
import globalStyles from '../utils/_css/globalStyle';

function SubReports({ navigation, user, token, route, value }) {
    const [subReport, setSubReportData] = useState([]);
    const [subReportBkp, setSubReportDataBkp] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const [sortDirections, setSortDirections] = useState({
    //     id: 'none', // Initialize with 'none' as the default
    //     group_name: 'none',
    //     start_date: 'none',
    //     end_date: 'none',
    // });
    // const [searchQuery, setSearchQuery] = useState('');
    // const [page, setPage] = useState(0);
    // const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
    // const [itemsPerPage, onItemsPerPageChange] = useState(
    //     numberOfItemsPerPageList[0]
    // );
    // const from = page * itemsPerPage;
    // const to = Math.min((page + 1) * itemsPerPage, completeData?.length);

    // React.useEffect(() => {
    //     setPage(0);
    // }, [itemsPerPage]);

    useEffect(() => {
        monitorService.reportDetails(token, value).then(res => {
            console.log(res)
            setSubReportData(res?.data?.data?.data);
            setSubReportDataBkp(res?.data?.data?.data);
            setIsLoading(false);
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
        });
    }, [])

    // const navigateDetails = (booking) => {
    //     route(booking?.id);
    //     // navigation.navigate({
    //     //   name: 'BookingDetails',
    //     //   params: { bookingId: booking.id },
    //     // });
    //     console.log(booking)
    // }

    // const handleSort = async (columnKey) => {
    //     const nextSortDirection =
    //         sortDirections[columnKey] === 'ascending'
    //             ? 'descending'
    //             : 'ascending';
    //     setSortDirections({
    //         ...sortDirections,
    //         [columnKey]: nextSortDirection,
    //     });
    //     // const value = await sortingHelper(completeData, columnKey, nextSortDirection)
    //     let sortDataType = typeof completeData[0]['booking'][columnKey];
    //     const sortedData = [...completeData].sort((a, b) => {
    //         const aValue = a['booking'][columnKey];
    //         const bValue = b['booking'][columnKey];
    //         switch (sortDataType) {
    //             case 'number':
    //                 return nextSortDirection === 'ascending' ? aValue - bValue : bValue - aValue;
    //             case 'string':
    //                 return nextSortDirection === 'ascending' ? aValue?.localeCompare(bValue) : bValue?.localeCompare(aValue);
    //             case 'object': // Assuming the data type is Date
    //                 return nextSortDirection === 'ascending' ? aValue?.getTime() - bValue?.getTime() : bValue?.getTime() - aValue?.getTime();
    //             default:
    //                 return 0; // Return 0 for unknown data types or if sortKey is not found
    //         }
    //     });
    //     setCompleteData(sortedData);
    // };
    // const handleSearch = (query) => {
    //     const lowerCaseQuery = query.toLowerCase();
    //     const filteredData = completeData.filter((item) =>
    //         item?.booking_id?.toString()?.toLowerCase()?.includes(lowerCaseQuery) ||
    //         item?.booking?.group_name?.toLowerCase()?.includes(lowerCaseQuery) ||
    //         formatDate(item?.booking?.start_date)?.toLowerCase()?.includes(lowerCaseQuery) ||
    //         formatDate(item?.booking?.end_date)?.toLowerCase()?.includes(lowerCaseQuery)
    //     );
    //     if (filteredData.length == 0 || query == '') {
    //         setCompleteData(completeDataBkp)
    //     } else {
    //         setCompleteData(filteredData)
    //     }
    //     setSearchQuery(query);
    // };

    return (
        <ScrollView style={styles.container}>
            <Text style={globalStyles.subtitle}> Sub-Reports</Text>
            <Divider style={globalStyles.divider} />
            <View style={styles.container}>
                {/* <Searchbar
                    placeholder="Search"
                    style={styles.Searchbar}
                    onChangeText={handleSearch}
                    value={searchQuery}
                /> */}
                {/* <View style={styles.container}>
        <Searchbar
         
          placeholder="Search"
          onChangeText={handleSearch}
          value={searchQuery}
        /> */}
                {/* <ScrollView horizontal >
                    <DataTable style={styles.DataTable}>
                        <DataTable.Header style={styles.header}>
                            <DataTable.Title sortDirection={sortDirections.id} onPress={() => handleSort('id')}> ID </DataTable.Title>
                            <DataTable.Title sortDirection={sortDirections.group_name} onPress={() => handleSort('group_name')} style={styles.headerCell}> Group Name </DataTable.Title>
                            <DataTable.Title sortDirection={sortDirections.start_date} onPress={() => handleSort('start_date')}>Start Date </DataTable.Title>
                            <DataTable.Title sortDirection={sortDirections.end_date} onPress={() => handleSort('end_date')}> End Date  </DataTable.Title>
                        </DataTable.Header>
                        {isLoading && (<LoadingContainer />)}
                        {completeData?.slice(from, to).map((item) => (
                            <DataTable.Row key={item.id} onPress={() => navigateDetails(item)}>
                                <DataTable.Cell >{item.booking.id} </DataTable.Cell>
                                <DataTable.Cell style={styles.cell} >{item.booking.group_name}</DataTable.Cell>
                                <DataTable.Cell >{formatDate(item.booking.start_date)} </DataTable.Cell>
                                <DataTable.Cell >{formatDate(item.booking.end_date)} </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                        {!completeData?.length && !isLoading && (<Text style={globalStyles.emptyData}> Data not found</Text>)}
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
                </ScrollView> */}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
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
    value: state.auth.value,
});

export default connect(mapStateToProps)(SubReports);