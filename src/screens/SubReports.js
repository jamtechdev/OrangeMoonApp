/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Portal, Dialog, Button, Text, DataTable, Divider, Searchbar, } from 'react-native-paper';
import { connect } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { monitorService } from '../utils/_services';
import { routeValue } from '../redux/actions/authActions';
import { formatDate, formatTime } from '../utils/_helpers';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingContainer from '../components/LoadingContainer';
import globalStyles from '../utils/_css/globalStyle';

function SubReports({ navigation, user, token, route, value }) {
    const [subReport, setSubReportData] = useState([]);
    const [subReportBkp, setSubReportDataBkp] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortDirections, setSortDirections] = useState({
        id: 'none',
        date: 'none',
        start_time: 'none',
        end_time: 'none',
        temperature: 'none',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, subReport?.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    useEffect(() => {
        monitorService.reportDetails(token, value.id).then(res => {
            console.log(res, res?.data?.data)
            setSubReportData(res?.data?.data);
            setSubReportDataBkp(res?.data?.data);
            setIsLoading(false);
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
        });
    }, [])

    const navigateDetails = (booking) => {
        // route(booking?.id);
        navigation.navigate('DetailsReport', { Booking: booking });
        console.log(booking)
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
        let sortDataType = typeof subReport[0][columnKey];
        const sortedData = [...subReport].sort((a, b) => {
            const aValue = a[columnKey];
            const bValue = b[columnKey];
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
        setSubReportData(sortedData);
    };
    const handleSearch = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        const filteredData = subReport.filter((item) =>
            item?.toString()?.toLowerCase()?.includes(lowerCaseQuery) ||
            formatDate(item?.date)?.toLowerCase()?.includes(lowerCaseQuery) ||
            formatTime(item?.start_time).includes(lowerCaseQuery) ||
            formatTime(item?.end_time).includes(lowerCaseQuery) ||
            item?.temperature.toLowerCase().includes(lowerCaseQuery)
        );
        if (filteredData.length === 0 || query === '') {
            setSubReportData(subReportBkp);
        } else {
            setSubReportData(filteredData);
        }
        setSearchQuery(query);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={globalStyles.subtitle}> Sub-Reports</Text>
            <Divider style={globalStyles.divider} />
            <View style={styles.container}>
                <Searchbar
                    placeholder="Search"
                    style={styles.Searchbar}
                    onChangeText={handleSearch}
                    value={searchQuery}
                />
                <ScrollView horizontal >
                    <DataTable style={styles.DataTable}>
                        <DataTable.Header style={styles.header}>
                            <DataTable.Title sortDirection={sortDirections.id} onPress={() => handleSort('id')}> ID </DataTable.Title>
                            <DataTable.Title sortDirection={sortDirections.date} onPress={() => handleSort('date')} > Date </DataTable.Title>
                            <DataTable.Title sortDirection={sortDirections.start_time} onPress={() => handleSort('start_time')}>Start Time </DataTable.Title>
                            <DataTable.Title sortDirection={sortDirections.end_time} onPress={() => handleSort('end_time')}> End Time  </DataTable.Title>
                            <DataTable.Title sortDirection={sortDirections.temperature} onPress={() => handleSort('temperature')}> Wellness Check Status </DataTable.Title>
                            <DataTable.Title > Action </DataTable.Title>
                        </DataTable.Header>
                        {isLoading && (<LoadingContainer />)}
                        {subReport?.slice(from, to).map((item) => (
                            <DataTable.Row key={item.id} onPress={() => navigateDetails(item)}>
                                <DataTable.Cell >{item.id} </DataTable.Cell>
                                <DataTable.Cell >{item?.date}</DataTable.Cell>
                                <DataTable.Cell >{formatTime(item?.start_time)} </DataTable.Cell>
                                <DataTable.Cell >{formatTime(item?.end_time)} </DataTable.Cell>
                                <DataTable.Cell > {item?.temperature} </DataTable.Cell>
                                <DataTable.Cell >  <Icon name='eye' size={20} color={AppStyles.color.tint} style={styles.icon} /> </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                        {!subReport?.length && !isLoading && (<Text style={globalStyles.emptyData}> Data not found</Text>)}
                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(subReport.length / itemsPerPage)}
                            onPageChange={(page) => setPage(page)}
                            label={`${from + 1}-${to} of ${subReport.length}`}
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