/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, {useMemo, useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Text, RefreshControl, Pressable} from 'react-native';
import {
  List,
  Card,
  ActivityIndicator,
  Button,
  Divider,
  Snackbar,
  DataTable,
  Portal,
  Modal,
  Dialog,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {monitorService} from '../utils/_services';
import {AppStyles} from '../utils/AppStyles';
import globalStyles from '../utils/_css/globalStyle';
import LoadingContainer from '../components/LoadingContainer';
import {formatDate, formatTime} from '../utils/_helpers';
import {Calendar} from 'react-native-big-calendar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useForm, Controller} from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormDateInput from '../components/FormDateInput';
import SearchBox from '../components/SearchBox';
import SchedulingModel from '../components/model/SchedulingModel';
import SchedulingDateDialog from '../components/dialog/SchedulingDateDialog';
import SchedulingCardList from '../components/cards/SchedulingCardList';
import SchedulingFilterSearch from '../components/searchFilter/ScheduleFilterSearch';
import NoDataFound from '../components/NoData';
function Scheduling({navigation, user, token, route}) {
  const [eventData, setEventData] = useState([]);
  const [assignableData, setAssignableData] = useState([]);
  const [assignableDataBkp, setAssignableDataBkp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleToast, setVisibleToast] = useState(false);
  const [visibleModel, setVisibleModel] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [startDate, setStartDate] = useState();
  const [textShow, setTextShow] = useState('');
  const [status, setStatus] = useState();
  const [endDate, setEndDate] = useState();
  const [bookingDetails, setBookingDetails] = useState([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [modelType, setModelType] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );
  const memoizedStartDate = useMemo(() => startDate, [startDate]);
  const memoizedEndDate = useMemo(() => endDate, [endDate]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, assignableData?.length);
  const showModal = () => setVisibleModel(true);
  const hideModal = () => setVisibleModel(false);
  const hideDialog = () => setVisibleDialog(false);
  const hideAlert = () => setShowAlert(false);
  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    getdayList();
    getAssignList();
  }, [token]);
  const handleRefresh = () => {
    setRefreshing(true);
    getdayList();
    getAssignList();
  }
  const getAssignList = () => {
    // setIsLoading(true);
    monitorService
      .getSchedulingAssignableBooking(token)
      .then(res => {
        setAssignableData(res?.data?.assingnable_bookings);
        setAssignableDataBkp(res?.data?.assingnable_bookings);
        // setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const getdayList = () => {
    setIsLoading(true);
    monitorService
      .getAllSchedulingEvent(token)
      .then(res => {
        for (const item of res.data.monitor_availability) {
          const date = new Date(item.date);
          item.start = date;
          item.end = date;
        }
        setEventData(res.data?.monitor_availability);
        setIsLoading(false);
        setIsButtonLoading(false);
        hideDialog();
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      }).finally(() => {
        setRefreshing(false);
      });
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };
  const onChangeDate = newDates => {
    const newDate = newDates[0];
    setSelectedDate(newDate);
  };
  const eventStyleGetter = (event, start, end, isSelected) => {
    return {
      backgroundColor: event.color,
      borderRadius: 5,
      opacity: 0.8,
      color: AppStyles.color.black,
      border: '3px solid black',
    };
  };

  const CustomEvent = ({event, touchableOpacityProps}) => (
    <Pressable
      {...touchableOpacityProps}
      onPress={() => onEventPress(event)}
      style={[styles.customEventContainer, {backgroundColor: event.color}]}
      key={event?.id}>
      {event.color !== 'yellow' ? (
        <Text style={styles.eventText}>{event.title}</Text>
      ) : (
        <Text style={[styles.eventText, {color: AppStyles.color.black}]}>
          {event.title}
        </Text>
      )}
    </Pressable>
  );

  const isDateWithin30Days = dateString => {
    const inputDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInMilliseconds = inputDate - currentDate;
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return differenceInDays <= 30;
  };
  const onEventPress = event => {
    const eventDate = new Date(event.date);
    const currentDate = new Date();
    if (event.status === 'OFFERED' || event.status === 'BOOKED') {
      if (!isDateWithin30Days(event.date)) {
        setVisibleToast(true);
        return;
      }
      if (event) {
        setIsLoading(true);
        monitorService
          .bookingDetails(token, event?.monitor_booking_request_id)
          .then(res => {
            setBookingDetails(res?.data?.data);
            setModelType(event?.status);
            showModal();
            setIsLoading(false);
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error);
          });
      }
      return;
    } else if (
      eventDate >= currentDate.setHours(0, 0, 0, 0) &&
      (event.status === 'NOT AVAILABLE' || event.status == 'AVAILABLE')
    ) {
      setVisibleDialog(true);
      setStartDate(event.date);
      setEndDate(event.date);
      return;
    } else {
      setVisibleToast(true);
    }
  };

  const updateAvailability = (start, end, status) => {
    console.log(start, end);
    let data = {
      start_date: start,
      end_date: end,
      status: status,
      start_time: '00:00:00',
      end_time: '23:59:00',
    };
    setIsButtonLoading(true);
    setTimeout(() => {
      monitorService
        .setMonitorAvailablity(token, data)
        .then(res => {
          console.log(res);
          if (res.data.status) {
            getdayList();
            // setTimeout(() => {
            //   hideDialog();
            // }, 1000);
          }
          // setIsButtonLoading(false);
        })
        .catch(error => {
          setIsButtonLoading(false);
          console.log(error);
        });
    }, 1000);
  };
  const updateRequestStatus = id => {
    setIsLoading(true);
    let data = {
      monitor_id: user.monitor.id,
      booking_day_id: id,
    };
    monitorService
      .setSelfBooking(token, data)
      .then(res => {
        setIsLoading(false);
        getAssignList();
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };
  const updateBookingStatus = (id, status) => {
    setIsLoading(true);
    monitorService
      .bookingChangeStatus(token, id, status)
      .then(res => {
        console.log(res);
        setIsLoading(false);
        hideAlert();
        getdayList();
        hideModal();
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };
  const showConfirmFunction = status => {
    setShowAlert(true);
    if (status == 1) {
      setStatus('ACCEPTED');
      setTextShow(
        'By Accepting, I agree to the payment terms outlined in my Seasonal Contractor agreement between myself and Orange Moon. I further agree to abide by the dresscode and conduct requirements established by Orange Moon of which I have read and maintain a copy of for my records.',
      );
    } else {
      if (status == 3) {
        setStatus('CANCEL');
      } else {
        setStatus('REJECTED');
      }
      setTextShow('You would not be able to undo.');
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={AppStyles.color.tint}
    />
  }
  showsVerticalScrollIndicator={false} 
        scrollIndicatorInsets={{top: 0, left: 0, bottom: 0, right: 0}}>
        <View style={styles.container}>
          <Text style={globalStyles.subtitle}> Manage Schedule </Text>
          <Divider style={globalStyles.divider} />
          <View style={styles.dateView}>
            <Button title="Today" onPress={goToToday}>
              <Text style={styles.todayButton}> Today</Text>
            </Button>
            <Text style={styles.monthText}>
              {selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <View style={styles.iconView}>
              <Icon
                color={AppStyles.color?.tint}
                style={styles.dateIcon}
                name="angle-left"
                size={30}
                onPress={goToPreviousMonth}
              />
              <Icon
                color={AppStyles.color?.tint}
                style={styles.dateIcon}
                name="angle-right"
                size={30}
                onPress={goToNextMonth}
              />
            </View>
          </View>
          <Calendar
            events={eventData || []}
            mode="month"
            height={400}
            date={selectedDate}
            showAllDayEventCell={true}
            onChangeDate={onChangeDate}
            eventCellStyle={eventStyleGetter}
            renderEvent={(event, touchableOpacityProps) => (
              <CustomEvent
                event={event}
                touchableOpacityProps={touchableOpacityProps}
              />
            )}
            onPressDateHeader={e =>
              console.log('onPressDateHeader date here ', e)
            }
            onPressCell={e => console.log('onPressCell date here ', e)}
            onPressEvent={e => console.log('onPressEvent date here ', e)}
          />

          <View style={styles.nextDiv}>
            <Text style={globalStyles.subtitle}> Open Assignments</Text>
            <Divider style={globalStyles.divider} />
            <SchedulingFilterSearch
              assignableData={assignableData}
              setAssignableData={setAssignableData}
              assignableDataBkp={assignableDataBkp}
            />
            {isLoading && <LoadingContainer />}
            {assignableData &&
              assignableData.map((item, index) => (
                <SchedulingCardList
                  key={index}
                  item={item}
                  updateRequestStatus={updateRequestStatus}
                />
              ))}
            {!assignableData?.length && !isLoading && (
           <NoDataFound />
            )}
            {/* <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(assignableData.length / itemsPerPage)}
              onPageChange={page => setPage(page)}
              label={`${from + 1}-${to} of ${assignableData.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            /> */}
          </View>
        </View>
      </ScrollView>
      <Snackbar
        visible={visibleToast}
        onDismiss={() => setVisibleToast(false)}
        duration={1000}>
        You are not able to take action on this date
      </Snackbar>
      <SchedulingDateDialog
        visibleDialog={visibleDialog}
        hideDialog={hideDialog}
        isButtonLoading={isButtonLoading}
        updateAvailability={updateAvailability}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setIsButtonLoading={setIsButtonLoading}
      />
      <SchedulingModel
        visibleModel={visibleModel}
        hideModal={hideModal}
        bookingDetails={bookingDetails}
        modelType={modelType}
        showConfirmFunction={showConfirmFunction}
      />
      <Portal>
        <Dialog visible={showAlert} onDismiss={hideAlert}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Content>
            <Text>{textShow}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              loading={isButtonLoading}
              onPress={() => {
                updateBookingStatus(bookingDetails.id, status);
              }}>
              Yes{' '}
            </Button>
            <Button mode="contained" onPress={hideAlert}>
              No
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
    height: 55,
  },
  iconCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
  iconGap: {
    width: 20,
  },
  hederGap: {
    width: 20,
  },
  nextDiv: {
    marginVertical: 15,
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  todayButton: {
    color: AppStyles.color?.tint,
    fontWeight: '700',
  },
  monthText: {
    textAlign: 'center',
    color: AppStyles.color?.black,
    fontWeight: '700',
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateIcon: {
    marginHorizontal: 15,
  },
  customEventContainer: {
    borderRadius: 5,
    padding: 8,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventText: {
    color: AppStyles.color.white,
    fontSize: 8,
    fontWeight: '600',
  },
  input: {
    marginTop: 15,
  },
  buttonStyle: {
    paddingHorizontal: 15,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountDetailsContainer: {
    marginTop: 10,
  },
  modalView: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    // paddingVertical:5,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 3,
  },
  keyText: {
    flex: 1,
    fontWeight: '700',
    color: '#777',
    marginRight: 4, // Add some margin for separation
    fontSize: 12,
  },
  valueText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
  },
  closeIcon: {
    right: 0,
    top: 15,
  },
  tableAddress: {
    flex: 3,
    width: 300,
  },
  tableAction: {
    flex: 2,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    color: AppStyles.color.white,
    backgroundColor: AppStyles.color.tint,
    fontSize: 8,
  },
});

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(mapStateToProps)(Scheduling);
