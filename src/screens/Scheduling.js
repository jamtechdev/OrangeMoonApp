/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  List,
  Card,
  ActivityIndicator,
  Button,
  Divider,
  Snackbar,
  TextInput,
  Portal,
  Modal,
  Dialog,
} from 'react-native-paper';
import { connect } from 'react-redux';
import { monitorService } from '../utils/_services';
import { AppStyles } from '../utils/AppStyles';
import globalStyles from '../utils/_css/globalStyle';
import LoadingContainer from '../components/LoadingContainer';
import { Calendar } from 'react-native-big-calendar';
import Icon from 'react-native-vector-icons/FontAwesome';
import SchedulingModel from '../components/model/SchedulingModel';
import SchedulingCardList from '../components/cards/SchedulingCardList';
import SchedulingFilterSearch from '../components/searchFilter/ScheduleFilterSearch';
import NoDataFound from '../components/NoData';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import io from 'socket.io-client';
import moment from 'moment';
function Scheduling({ navigation, user, token, route }) {
  // const socket = io('https://dev.orangemoonsss.com');
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
  const [isStartDateVisible, setIsStartDateVisible] = useState(false);
  const [isEndDateVisible, setIsEndDateVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());


  const showModal = () => setVisibleModel(true);
  const hideModal = () => setVisibleModel(false);
  const hideDialog = () => setVisibleDialog(false);
  const hideAlert = () => setShowAlert(false);

  useEffect(() => {
    getdayList();
    getAssignList();
  }, [token]);

  // useEffect(() => {
  //   // Listen for live calender update check 
  //   socket.on('update-calender', () => {
  //     getdayList();
  //     getAssignList();
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getdayList();
    getAssignList();
  };
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
    // setIsLoading(true);
    monitorService
      .getAllSchedulingEvent(token)
      .then(res => {
        console.log(res.data, 'monitor availability response');

        for (const item of res.data.monitor_availability) {
          const date = moment(item?.date)
          // const date = new Date(item.date);
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
      })
      .finally(() => {
        setRefreshing(false);
      });
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

  const CustomEvent = ({ event, touchableOpacityProps }) => (
    <Pressable
      {...touchableOpacityProps}
      onPress={() => onEventPress(event)}
      style={[styles.customEventContainer, { backgroundColor: event.color }]}
      key={event?.id}>
      {event.color !== 'yellow' ? (
        <Text style={styles.eventText}>{event.title}</Text>
      ) : (
        <Text style={[styles.eventText, { color: AppStyles.color.black }]}>
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
    const currentDate = moment().startOf('day');
    const eventDate = moment(event.date).startOf('day');
    console.log(eventDate.isSameOrAfter(currentDate));

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
      eventDate.isSameOrAfter(currentDate) &&
      (event.status === 'NOT AVAILABLE' || event.status === 'AVAILABLE')
    ) {
      // Setting the start and end date directly without opening the Dialog
      setStartDate(event.date);
      setEndDate(event.date);
      setVisibleDialog(true);
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
            getAssignList();
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
        if (res.data.status) {
          getAssignList();
          getdayList();
        }
        // setIsLoading(false);
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


        getdayList();
        console.log(res);
        setIsLoading(false);
        hideAlert();
        getdayList();
        hideModal();
        getAssignList();
        // getdayList();
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

  const handleConfirmEnd = dateTimeString => {
    console.warn('A date has been picked: ', dateTimeString);
    const date = moment(dateTimeString);
    setIsEndDateVisible(false);

    const formattedDate = date.format('YYYY-MM-DD');
    setEndDate(formattedDate);
    setIsEndDateVisible(false);
  };

  const handleConfirmStart = dateTimeString => {
    console.warn('A date has been picked: ', dateTimeString);
    const date = moment(dateTimeString);
    setIsStartDateVisible(false);

    const formattedDate = date.format('YYYY-MM-DD');
    setStartDate(formattedDate);
  };


  const checkEventOrNot = event => {
    const targetDate = moment(event);
    console.log(targetDate, 'date');

    const formattedDate = targetDate.format('YYYY-MM-DD');
    const today = moment().startOf('day');

    if (!targetDate.isSameOrAfter(today)) {
      setVisibleToast(true);
      return;
    }

    const dateExists = eventData.some(item => {
      const itemDate = moment(item.date);
      return itemDate.isSame(targetDate, 'day');
    });

    if (!dateExists) {
      setVisibleDialog(true);
      setStartDate(formattedDate);
      setEndDate(formattedDate);
      console.log('The target date does not exist in the array.');
    }
  };

  const goToPreviousMonth = useCallback(() => {
    setSelectedDate(prevDate => prevDate.clone().subtract(1, 'month'));
  }, []);

  const goToNextMonth = useCallback(() => {
    setSelectedDate(prevDate => prevDate.clone().add(1, 'month'));
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(moment());
  }, []);

  const onChangeDate = newDates => {
    const newDate = moment(newDates[0]);
    setSelectedDate(newDate);
  };

  const formattedDate = useMemo(() => selectedDate.format('MMMM YYYY'), [selectedDate]);

  const [currentMonthEvents, setCurrentMonthEvents] = useState();

  const getCurrentMonthEvents = () => {
    const startOfCurrentMonth = moment(selectedDate).startOf('month');
    const endOfCurrentMonth = moment(selectedDate).endOf('month');

    const startOfPrevMonth = moment(selectedDate).subtract(1, 'month').startOf('month');
    const endOfPrevMonth = moment(selectedDate).subtract(1, 'month').endOf('month');

    const startOfNextMonth = moment(selectedDate).add(1, 'month').startOf('month');
    const endOfNextMonth = moment(selectedDate).add(1, 'month').endOf('month');

    const currentMonthEvents = eventData.filter(event => {
      const eventDate = moment(event.date);
      return eventDate.isBetween(startOfCurrentMonth, endOfCurrentMonth, null, '[]') ||
        (eventDate.isBetween(startOfPrevMonth, endOfPrevMonth, null, '[]') && eventDate.date() >= endOfPrevMonth.date() - 6) ||
        (eventDate.isBetween(startOfNextMonth, endOfNextMonth, null, '[]') && eventDate.date() <= startOfNextMonth.date() + 6);
    });

    setCurrentMonthEvents(currentMonthEvents);
  };

  useEffect(() => {
    getCurrentMonthEvents();
  }, [eventData, selectedDate])
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
        scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 0 }}>
        <View style={styles.container}>
          <Text style={globalStyles.subtitle}> Manage Schedule </Text>
          <Divider style={globalStyles.divider} />
          <View style={styles.dateView}>
            <TouchableOpacity onPress={goToToday}>
              <Text style={styles.todayButton}> Today</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>{formattedDate}</Text>
            <View style={styles.iconView}>
              <TouchableOpacity onPress={goToPreviousMonth}>
                <Icon
                  color={AppStyles.color?.tint}
                  style={styles.dateIcon}
                  name="angle-left"
                  size={30}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={goToNextMonth}>
                <Icon
                  color={AppStyles.color?.tint}
                  style={styles.dateIcon}
                  name="angle-right"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Calendar
            events={currentMonthEvents || []}
            mode="month"
            height={400}
            date={selectedDate.toDate()} // Convert to JavaScript Date object
            showAllDayEventCell={true}
            onChangeDate={onChangeDate}
            eventCellStyle={eventStyleGetter}
            renderEvent={(event, touchableOpacityProps) => (
              <CustomEvent
                event={event}
                touchableOpacityProps={touchableOpacityProps}
              />
            )}
            onPressDateHeader={e => console.log('onPressDateHeader date here ', e)}
            onPressCell={e => checkEventOrNot(e)}
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
            {!assignableData?.length && !isLoading && <NoDataFound />}
          </View>
        </View>
      </ScrollView>
      <Snackbar
        visible={visibleToast}
        onDismiss={() => setVisibleToast(false)}
        duration={1000}>
        You are not able to take action on this date
      </Snackbar>
      <Portal>
        <Dialog visible={visibleDialog} onDismiss={hideDialog}>
          <View style={styles.rowView}>
            <Dialog.Title style={globalStyles.subtitle}>
              Scheduling
            </Dialog.Title>
            <Icon
              color={AppStyles.color?.tint}
              style={globalStyles.rightImageIcon}
              name="close"
              size={20}
              onPress={hideDialog}
            />
          </View>
          <Divider style={globalStyles.divider} />
          <Dialog.Content>
            <View style={styles.input}>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setIsStartDateVisible(true);
                }}>
                <View style={styles.detailItem}>
                  <Text style={styles.labelText}>Start Date : </Text>

                  <TextInput
                    style={styles.valueInput}
                    value={startDate}
                    disabled={true}
                  />
                  <View
                    style={styles.startEndDateTextInputView}
                    onPress={() => setIsStartDateVisible(true)}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.detailItem}>
                <Text style={styles.labelText}>End Date : </Text>
                <TouchableOpacity onPress={() => setIsEndDateVisible(true)}>
                  <TextInput
                    style={styles.valueInput}
                    value={endDate}
                    disabled={true}
                  />

                  <View
                    style={styles.startEndDateTextInputView}
                    onPress={() => setIsEndDateVisible(true)}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <ActivityIndicator
              animating={isButtonLoading}
              color={AppStyles.color.tint}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() =>
                updateAvailability(startDate, endDate, 'NOT AVAILABLE')
              }>
              NOT AVAILABLE{' '}
            </Button>
            <Button
              textColor={AppStyles.color.white}
              buttonColor={AppStyles.color.tint}
              mode="contained-tonal"
              style={styles.buttonStyle}
              onPress={() =>
                updateAvailability(startDate, endDate, 'AVAILABLE')
              }>
              AVAILABLE
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* <SchedulingDateDialog
        visibleDialog={visibleDialog}
        hideDialog={hideDialog}
        isButtonLoading={isButtonLoading}
        updateAvailability={updateAvailability}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setIsButtonLoading={setIsButtonLoading}
      /> */}
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
      <DateTimePickerModal
        isVisible={isStartDateVisible}
        mode="date"
        date={new Date(startDate)}
        onConfirm={handleConfirmStart}
        onCancel={() => setIsStartDateVisible(false)}
      />

      <DateTimePickerModal
        isVisible={isEndDateVisible}
        mode="date"
        date={new Date(endDate)}
        onConfirm={handleConfirmEnd}
        onCancel={() => setIsEndDateVisible(false)}
      />
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
  detailItem: {
    marginBottom: 10,
  },
  labelText: {
    // width: '40%',
    fontSize: 16,
    color: '#777',
    fontWeight: '700',
    marginRight: 10,
    textAlign: 'left',
    paddingBottom: 10,
  },
  valueInput: {
    // flex: 1,
    fontSize: 15,
    marginBottom: 10,
    // width: AppStyles.textInputWidth.full,
  },
  startEndDateTextInputView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
});

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(mapStateToProps)(Scheduling);
