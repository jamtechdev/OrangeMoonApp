/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Portal, Dialog, Button, Text, DataTable, SegmentedButtons, Searchbar, } from 'react-native-paper';
import { connect } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { monitorService } from '../utils/_services';
import { routeValue } from '../redux/actions/authActions';
import { formatDate, sortingHelper } from '../utils/_helpers';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingContainer from '../components/LoadingContainer';
import globalStyles from '../utils/_css/globalStyle';
function BookingRequest({ navigation, user, token, route }) {
  const [bookingData, setBookingData] = useState([]);
  const [bookingDataBkp, setBookingDataBkp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [segmentedValue, setSegmentedValue] = useState('All');
  const [sortDirections, setSortDirections] = useState({
    booking_id: 'none', // Initialize with 'none' as the default
    group_name: 'none',
    dates: 'none',
    status: 'none',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [updateId, setUpdateId] = useState();
  const [isAcceptDialogVisible, setIsAcceptDialogVisible] = useState(false);
  const [isRejectDialogVisible, setIsRejectDialogVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, bookingData?.length);
  const toggleDialogAccept = () => { setIsAcceptDialogVisible(!isAcceptDialogVisible); };
  const toggleDialogReject = () => { setIsRejectDialogVisible(!isRejectDialogVisible); };

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const SegmentedButtonsValue = [
    { value: 'All', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'CANCEL', label: 'Cancelled' },
  ]

  useEffect(() => {
    monitorDataCall()
  }, [segmentedValue])

  const monitorDataCall = () => {
    monitorService.bookingRequest(token, segmentedValue).then(res => {
      console.log(res, "here my console res");
      setBookingData(res?.data?.data)
      setBookingDataBkp(res?.data?.data)
      setIsLoading(false)
    }).catch(error => {
      console.log(error);
      setIsLoading(false)
    })
  }
  const navigateDetails = (booking) => {
    route(booking?.id);
    navigation.navigate({
      name: 'BookingDetails',
      params: { bookingId: booking.id },
    });

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
    const value = await sortingHelper(bookingData, columnKey, nextSortDirection)
    console.log(value);
    setBookingData(value);
  };

  const updateBookingStatus = (status) => {
    setIsButtonLoading(true);
    monitorService.bookingChangeStatus(token, updateId, status).then(res => {
      setIsButtonLoading(false);
      if (res?.data?.status === true) {
        monitorDataCall();
      }
      if (status === 'ACCEPTED') {
        toggleDialogAccept();
      } else {
        toggleDialogReject();
      }
    }).catch(error => {
      setIsButtonLoading(false);
      console.log(error);
    })
  }
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredData = bookingData.filter((item) =>
      item?.booking_id?.toString()?.toLowerCase()?.includes(lowerCaseQuery) ||
      item?.group_name?.toLowerCase()?.includes(lowerCaseQuery) ||
      formatDate(item?.dates)?.toLowerCase()?.includes(lowerCaseQuery) ||
      item?.status?.toLowerCase()?.includes(lowerCaseQuery)
    );
    if (filteredData.length == 0 || query == '') {
      setBookingData(bookingDataBkp)
    } else {
      setBookingData(filteredData)
    }
    setSearchQuery(query);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SegmentedButtons
            value={segmentedValue}
            theme={{ colors: { primary: 'green', secondaryContainer: AppStyles.color.tint, onSecondaryContainer: AppStyles.color.white } }}
            onValueChange={setSegmentedValue}
            buttons={SegmentedButtonsValue}
          />
        </ScrollView>
        <Searchbar
          style={styles.Searchbar}
          placeholder="Search"
          onChangeText={handleSearch}
          value={searchQuery}
        />
        <ScrollView horizontal >
          <DataTable style={styles.DataTable}>
            <DataTable.Header style={styles.header}>
              <DataTable.Title sortDirection={sortDirections.booking_id} onPress={() => handleSort('booking_id')}> ID </DataTable.Title>
              <DataTable.Title sortDirection={sortDirections.group_name} onPress={() => handleSort('group_name')} style={styles.headerCell}> Group Name </DataTable.Title>
              <DataTable.Title sortDirection={sortDirections.dates} onPress={() => handleSort('dates')}> Date </DataTable.Title>
              <DataTable.Title sortDirection={sortDirections.status} onPress={() => handleSort('status')}> <View style={styles.hederGap} /> Status </DataTable.Title>
              <DataTable.Title > <View style={styles.hederGap} /> Action</DataTable.Title>
              <DataTable.Title > <View style={styles.hederGap} /> </DataTable.Title>
              <DataTable.Title > <View style={styles.hederGap} /> </DataTable.Title>
            </DataTable.Header>
            {isLoading && (<LoadingContainer />)}
            {bookingData?.slice(from, to).map((item) => (
              <DataTable.Row key={item.id} >
                <DataTable.Cell >{item.booking_id} <View style={styles.iconGap} /></DataTable.Cell>
                <DataTable.Cell style={styles.cell} >{item.group_name}</DataTable.Cell>
                <DataTable.Cell >{formatDate(item.dates)} <View style={styles.hederGap} /> </DataTable.Cell>
                <DataTable.Cell >{item.status} <View style={styles.iconGap} /></DataTable.Cell>
                <DataTable.Cell style={styles.iconCell} onPress={() => navigateDetails(item)} >
                  <View style={styles.iconGap} />
                  {item?.status !== "REJECTED" && item?.status !== "CANCEL" ? (<Icon name='eye' size={20} color={AppStyles.color.tint} style={styles.icon} />
                  ) : ''}
                  <View style={styles.iconGap} />
                </DataTable.Cell>
                <DataTable.Cell style={styles.iconCell} >
                  {item?.status === "PENDING" ? (
                    <Pressable onPress={() => { toggleDialogAccept(); setUpdateId(item.id); }}>
                      <Icon name='check' size={20} color={AppStyles.color.tint} style={styles.icon} />
                    </Pressable>
                  ) : <View style={styles.iconGap} />}
                  <View style={styles.iconGap} />
                </DataTable.Cell>
                <DataTable.Cell style={styles.iconCell} >
                  {item?.status === "PENDING" ? (
                    <Pressable onPress={() => { toggleDialogReject(); setUpdateId(item.id); }} >
                      <Icon name='close' size={20} color={AppStyles.color.tint} style={styles.icon} />
                    </Pressable>
                  ) : <View style={styles.iconGap} />}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            {!bookingData?.length && !isLoading && (<Text style={globalStyles.emptyData}> Data not found</Text>)}
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(bookingData.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${bookingData.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
        </ScrollView>
      </View>
      <Portal>
        <Dialog visible={isAcceptDialogVisible} onDismiss={toggleDialogAccept}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Content>
            <Text>By Accepting, I agree to the payment terms outlined in my Seasonal Contractor agreement between myself and Orange Moon. I further agree to abide by the dresscode and conduct requirements established by Orange Moon of which I have read and maintain a copy of for my records.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" loading={isButtonLoading} onPress={() => { updateBookingStatus('ACCEPTED') }}>Yes </Button>
            <Button mode="contained" onPress={toggleDialogAccept}>No</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={isRejectDialogVisible} onDismiss={toggleDialogReject}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Content>
            <Text>You won't be able to undo.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" loading={isButtonLoading} onPress={() => { updateBookingStatus('REJECTED') }}>Yes </Button>
            <Button mode="contained" onPress={toggleDialogReject}>No</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    marginTop: 20,
  }

});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
});
const mapDispatchToProps = (dispatch) => ({
  route: (id) => { dispatch(routeValue(id)), console.log(id, 'ghere') },
});
export default connect(mapStateToProps, mapDispatchToProps)(BookingRequest);