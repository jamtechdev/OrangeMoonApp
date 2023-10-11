/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Pressable, FlatList} from 'react-native';
import {
  Portal,
  Dialog,
  Button,
  Text,
  DataTable,
  Divider,
  SegmentedButtons,
} from 'react-native-paper';
import {Configuration} from '../utils/Configuration';
import {connect} from 'react-redux';
import {AppStyles} from '../utils/AppStyles';
import {monitorService} from '../utils/_services';
import {routeValue} from '../redux/actions/authActions';
import {formatDate, sortingHelper, formatDateNew} from '../utils/_helpers';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingContainer from '../components/LoadingContainer';
import globalStyles from '../utils/_css/globalStyle';
import FilterSearch from '../components/searchFilter/BookingFilterSearch';
import BookingCardList from '../components/cards/BookingCardList';

function BookingRequest({navigation, user, token, route}) {
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
    numberOfItemsPerPageList[0],
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, bookingData?.length);
  const toggleDialogAccept = () => {
    setIsAcceptDialogVisible(!isAcceptDialogVisible);
  };
  const toggleDialogReject = () => {
    setIsRejectDialogVisible(!isRejectDialogVisible);
  };

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const SegmentedButtonsValue = [
    {value: 'All', label: 'All'},
    {value: 'PENDING', label: 'Pending'},
    {value: 'ACCEPTED', label: 'Accepted'},
    {value: 'COMPLETED', label: 'Completed'},
    {value: 'REJECTED', label: 'Rejected'},
    {value: 'CANCEL', label: 'Cancelled'},
  ];

  useEffect(() => {
    monitorDataCall();
  }, [segmentedValue]);

  const monitorDataCall = () => {
    monitorService
      .bookingRequest(token, segmentedValue)
      .then(res => {
        setBookingData(res?.data?.data);
        setBookingDataBkp(res?.data?.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const navigateDetails = booking => {
    route(booking?.id);
    navigation.navigate({
      name: 'BookingDetails',
      params: {bookingId: booking.id},
    });
  };



  const updateBookingStatus = status => {
    setIsButtonLoading(true);
    monitorService
      .bookingChangeStatus(token, updateId, status)
      .then(res => {
        setIsButtonLoading(false);
        if (res?.data?.status === true) {
          monitorDataCall();
        }
        if (status === 'ACCEPTED') {
          toggleDialogAccept();
        } else {
          toggleDialogReject();
        }
      })
      .catch(error => {
        setIsButtonLoading(false);
        console.log(error);
      });
  };

  return (
    <>
      <ScrollView style={styles.container}>
      <Text style={globalStyles.subtitle}>Booking Request</Text>
        <Divider style={globalStyles.divider} />
        <View style={styles.container}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <SegmentedButtons
              value={segmentedValue}
              theme={{
                colors: {
                  primary: 'green',
                  secondaryContainer: AppStyles.color.tint,
                  onSecondaryContainer: AppStyles.color.white,
                },
              }}
              onValueChange={setSegmentedValue}
              buttons={SegmentedButtonsValue}
              style={styles.segmentButtonSection}
            />
          </ScrollView>
          <FilterSearch
            bookingDataBkp={bookingDataBkp}
            setBookingData={setBookingData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortDirections={sortDirections}
            setSortDirections={setSortDirections}
            bookingData={bookingData}
          />
          <FlatList
            data={bookingData?.slice(from, to)}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <BookingCardList
              item={item}
              id={item.booking_id}
              status={item.status}
              groupName={item.group_name}
              date={formatDateNew(item.dates)}
              navigateDetails={navigateDetails}
              toggleDialogAccept={toggleDialogAccept}
              toggleDialogReject={toggleDialogReject}
              setUpdateId={setUpdateId}
            />
            )}
            // onEndReached={()=>setPage(page + 1)}
            // onEndReachedThreshold={0.1}
          />
          <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(bookingData.length / itemsPerPage)}
                onPageChange={page => setPage(page)}
                label={`${from + 1}-${to} of ${bookingData.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                showFastPaginationControls
                selectPageDropdownLabel={'Rows per page'}
              />
        </View>
        <Portal>
          <Dialog
            visible={isAcceptDialogVisible}
            onDismiss={toggleDialogAccept}>
            <Dialog.Title>Are you sure?</Dialog.Title>
            <Dialog.Content>
              <Text>
                By Accepting, I agree to the payment terms outlined in my
                Seasonal Contractor agreement between myself and Orange Moon. I
                further agree to abide by the dresscode and conduct requirements
                established by Orange Moon of which I have read and maintain a
                copy of for my records.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                mode="contained"
                loading={isButtonLoading}
                onPress={() => {
                  updateBookingStatus('ACCEPTED');
                }}>
                Yes{' '}
              </Button>
              <Button mode="contained" onPress={toggleDialogAccept}>
                No
              </Button>
            </Dialog.Actions>
          </Dialog>
          <Dialog
            visible={isRejectDialogVisible}
            onDismiss={toggleDialogReject}>
            <Dialog.Title>Are you sure?</Dialog.Title>
            <Dialog.Content>
              <Text>You won't be able to undo.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                mode="contained"
                loading={isButtonLoading}
                onPress={() => {
                  updateBookingStatus('REJECTED');
                }}>
                Yes{' '}
              </Button>
              <Button mode="contained" onPress={toggleDialogReject}>
                No
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
      {isLoading && (
        <Portal>
          <LoadingContainer />
        </Portal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: Configuration.home.listing_item.offset,
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
    flexDirection: 'row', // Ensure header cells are in a row
    alignItems: 'center', // Center header text vertically
  },

  headerCell: {
    width: 200,
    height: 50,
  },
  cell: {
    height: 55,
  },
  iconCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  segmentButtonSection: {
    borderColor: '#fff',
    borderCurve: 0,
    borderRadius: 1,
  },
});

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token,
});
const mapDispatchToProps = dispatch => ({
  route: id => {
    dispatch(routeValue(id)), console.log(id, 'ghere');
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(BookingRequest);
