/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  Alert,
  AppState
} from 'react-native'; // Import View
import { connect } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';
import { authService, chatService, monitorService } from '../utils/_services';
import {
  Divider,
  Text,
  Portal,
  Button,
  Dialog,
  RadioButton,
  DataTable,
  TextInput,
  Card,
  HelperText,
  Snackbar,
} from 'react-native-paper';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { formatDate, formatTime, sortingHelper } from '../utils/_helpers';
import globalStyles from '../utils/_css/globalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingContainer from '../components/LoadingContainer';
import Geolocation from '@react-native-community/geolocation';
import SearchBox from '../components/SearchBox';
import TodayFilterSearch from '../components/searchFilter/TodaySearchFilter';
import TodayBookingCardList from '../components/cards/TodayBookingCardList';
import FormDateInput from '../components/FormDateInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormTextInput from '../components/FormTextInput';
import moment from 'moment';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RefreshControl } from 'react-native';
import FormRadioButtons from '../components/FormRadioButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TodayBookingModel from '../components/model/TodayBookingModel';
import NoDataFound from '../components/NoData';
import IncidentModel from '../components/model/IncidentModel';
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import TokenAlert from '../components/dialog/TokenAlertDialog';
import { unreadCount } from '../redux/actions/authActions';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import DeviceInfo from 'react-native-device-info';
import { IOS_STORE_VERSION } from '../utils/Connection';

function HomeScreen({ navigation, user, token, unreadCount }) {
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardDataBkp, setDashboardDataBkp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(null);
  const [sortDirections, setSortDirections] = useState({
    group_name: 'none',
    date: 'none',
    start_time: 'none',
    end_time: 'none',
    status: 'none',
  });
  const [askQuestion, setAskQuestion] = useState({
    question1: true,
    value1: '',
    question2: false,
    value2: '',
    question3: false,
    value3: '',
    question4: false,
    value4: '',
  });
  const [bookingId, setBookingId] = useState(0);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState();
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, dashboardData?.length);
  //here new code
  const [next, setNext] = useState(0);
  const [radioButton, setRadio] = useState(false);

  const [checked, setChecked] = React.useState('first');
  const [question, setQuestion] = useState([]);
  const [precheckQuestions, setPrecheckQuestion] = useState([]);
  const [description, setDescription] = useState([]);
  const [status, setStatus] = useState([]);
  const [questionaire, setquestionaire] = useState([]);
  const [selectedTime, setSelectedTime] = useState('12:00 PM');
  const [selectedTimeLast, setSelectTimeLast] = useState('12:30 PM');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isTimePickerVisibleLast, setTimePickerVisibilitylast] =
    useState(false);
  const [DescriptionActivity, setDescriptionActivity] = useState(0);
  const [helper, setHelpertext] = useState(false);
  const [Message, setMessage] = useState();
  const [visible, setVisible] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [visible3, setVisible3] = React.useState(false);
  const [visible4, setVisible4] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [item, setItem] = React.useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('Answer is required'),
    preference: Yup.string().required('Preference is required'),
    precheckquestions: Yup.string(),
    description: Yup.string(),
  });
  const incidentvalidationSchema = Yup.object().shape({
    incidentdescription: Yup.string().required('Description is required'),
    location: Yup.string().required('Description is required'),
    external: Yup.string().required('External is required'),
    witness: Yup.string().required('Witness is required'),
    witness_description: Yup.string().required(
      'Witness description is required',
    ),
    students: Yup.string().required('Students is required'),
    rooms: Yup.string().required('Rooms is required'),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      // preference: 'Yes',
    },
  };
  const formOptionsIncident = {
    resolver: yupResolver(incidentvalidationSchema),
    mode: 'onChange',
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const inAppUpdates = new SpInAppUpdates(
    false // isDebug
  );

  const checkUpdate = () => {
    if (Platform.OS === 'android') {
      inAppUpdates.checkNeedsUpdate().then((result) => {
        if (result.shouldUpdate) {
          let updateOptions = {
            updateType: IAUUpdateKind.FLEXIBLE,
          };
          inAppUpdates.startUpdate(updateOptions);
        }
      });
    } {
      inAppUpdates.checkNeedsUpdate({ curVersion: IOS_STORE_VERSION }).then((result) => {
        console.log(result)
        if (result.shouldUpdate) {
          inAppUpdates.startUpdate(updateOptions);
        }
      });
    }

  }

  useEffect(() => {
    checkUpdate()
  }, [])

  const handleActivitySubmit = async () => {
    if (!DescriptionActivity || DescriptionActivity.length === 0) {
      setHelpertext(true);
      return;
    }
    setIsLoading(true);
    Geolocation.requestAuthorization();

    if (Platform.OS === 'android') {
      const checkEnabled = await isLocationEnabled();
      console.log('checkEnabled', checkEnabled);

      if (!checkEnabled) {
        console.error('Location services are not enabled.');
        setIsLoading(false);
        return;
      }
    }

    let locationObtained = false;

    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation(position.coords);
      console.log(latitude, longitude);
      const data = new Object({
        booking_day_report_id: bookingId,
        activity_lat: latitude,
        activity_lng: longitude,
        start_time: selectedTime,
        end_time: selectedTimeLast,
        description: DescriptionActivity,
      });
      apiActivitySubmit(data)
      locationObtained = true;
    };

    const onError = (error) => {
      console.error(error.message);
      setIsLoading(false);
      if (!locationObtained) {
        console.error('Failed to obtain location.');
      }
    };

    Geolocation.getCurrentPosition(onSuccess, onError,
      Platform.OS === 'android' ? { enableHighAccuracy: true } : {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      });
  };
  const apiActivitySubmit = (data) => {
    setHelpertext(false);

    console.log('Add new activity data', data);
    monitorService
      .bookingdayActivity(token, data)
      .then(res => {
        console.log(res.data, "here active response ")
        setMessage(res.data.message);
        setVisible3(true);
        setDescriptionActivity(0);
        hideModal1();
      })
      .catch(error => {
        console.log(error, ' here activity response error')
        setVisible3(true);
        setDescriptionActivity(0);
        hideModal1();
      }).finally(() => setIsLoading(false))
  }

  // here app state update end
  const handleTimeConfirm = time => {
    setSelectedTime(moment(time).format('hh:mm A'));
    setSelectTimeLast(moment(time).add(30, 'minutes').format('hh:mm A'));
    hideTimePicker();
  };
  //--------------------------------------------------------------------------
  const showTimeLastPicker = () => {
    setTimePickerVisibilitylast(true);
  };

  const hideTimeLastPicker = () => {
    setTimePickerVisibilitylast(false);
  };

  const handleTimeLastConfirm = time => {
    console.warn('A date has been picked: ', time);
    setSelectTimeLast(moment(time).format('hh:mm A'));
    setSelectedTime(moment(time).subtract(30, 'minutes').format('hh:mm A'));
    hideTimeLastPicker();
  };
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm(formOptions);
  const {
    control: control2,
    reset: reset2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    watch: watch2,
    formState: { errors: errors2 },
  } = useForm(formOptionsIncident);
  const onSubmit = data => {
    // console.log("data are", data)
    setDescription([...description, data.first_name]);
    setStatus([...status, data.preference]);
    setquestionaire([...questionaire, precheckQuestions[next].question]);
    reset();
    precheckpostApi();
  };
  const [time, setTime] = useState({ hours: '12', minutes: '00' });
  const [visibleTime, setVisibleTime] = React.useState(false);
  const onDismiss = React.useCallback(() => {
    setVisibleTime(false);
  }, [setVisible]);

  const isFocused = useIsFocused();
  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'always',
      enableBackgroundLocationUpdates: false,
      locationProvider: 'auto'
    });
    todayReportData();
    getPrecheckData();
    getGeoLocation();
    if (Platform.OS === 'android') {
      handleEnabledPressed()
    }
  }, [isFocused]);
  useEffect(() => {
    const areArraysReady =
      questionaire.length === 11 &&
      status.length === 11 &&
      description.length === 11;
    if (areArraysReady) {
      precheckpostApi();
      setNext(0);
      hideModal();
    }
  }, [questionaire, status, description]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    todayReportData();
    getPrecheckData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getPrecheckData = () => {
    monitorService
      .precheckquestion(token)
      .then(res => {
        setPrecheckQuestion(res?.data.questions);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
        // navigation.navigate('LoginStack')
      });
  };
  const checkActive = monitorBookingDayRequest => {
    const currentDateTime = new Date();
    const firstTime = new Date(currentDateTime);
    const secondTime = new Date(
      monitorBookingDayRequest.booking_day.date +
      ' ' +
      monitorBookingDayRequest.booking_day.start_time,
    );
    const intervalInMilliseconds = secondTime - firstTime;
    const intervalInHours = intervalInMilliseconds / (1000 * 60 * 60);

    let active = false;
    if (intervalInHours <= 8 && intervalInHours > 1) {
      active = true;
    }

    const getBookingTimeZone =
      monitorBookingDayRequest.booking_day.booking?.hotel?.state?.time_zone ||
      'EST'; // here i don't get the hotel state timezone
    const timeZone = new Date().toLocaleString('en-US', {
      timeZone: getBookingTimeZone,
    });
    const currentDate = new Date(timeZone).toISOString().split('T')[0];
    return currentDate;
  };
  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setVisibleTime(false);
      console.log({ hours, minutes });
      setTime({ hours: hours, minutes: minutes });
    },
    [setVisible],
  );
  const precheckpostApi = () => {
    // console.log("location",location)
    const data = new Object({
      booking_day_report_id: bookingId,
      start_location_lat: location != null ? location?.latitude : null,
      start_location_lng: location != null ? location?.longitude : null,
      precheck_question: questionaire,
      status: status,
      description: description,
    });
    monitorService
      .prechecksResponse(token, data)
      .then(res => {
        console.log('response', res);
        setNext(0);
        hideModal();
        todayReportData();
      })
      .catch(error => {
        console.log(error);
        setNext(0);
        hideModal();
      });
  };

  const handleNext = (data, newdata) => {
    setDescription([...description, data.first_name]);
    setStatus([...status, data.preference]);
    setquestionaire([...questionaire, precheckQuestions[next].question]);
    reset();
    setRadio(false);
    if (next != 11) {
      setNext(next + 1);
    }
  };


  const showModal = () => setVisible(true);
  const hideModal = () => {
    setNext(0);
    setDescription([]);
    setStatus([]);
    setquestionaire([]);
    setVisible(false);
    reset();
  };
  const hideModal1 = () => {
    setVisible1(false);
  };
  const hideModal2 = () => {
    setVisible2(false);
    reset2();
  };
  const hideModal3 = () => {
    setVisible3(false);
  };
  const hideModal4 = () => {
    setVisible4(false);
  };
  const openPrecheckDialog = (item, name) => {
    // Modal for play , plus and circle plus icons
    console.log('name', name);

    const report = item?.monitor_booking_day_report;

    if (report) {
      setBookingId(report.id);

      if (item.precheckCount === 0) {
        showModal();
      } else {
        name === 'plus' ? setVisible1(true) : setVisible2(true);
      }
    }
  };
  const openActionDialog = (item, name) => {
    console.log('name', name);
    if (name === 'stop') {
      setVisible4(true);
      setItem(item);
    } else {
      setIsDialogVisible(true);
      setBookingId(item.id);
    }
  };

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  const closeActionDialog = () => {
    setAskQuestion({
      ...sortDirections,
      question1: true,
      question2: false,
      question3: false,
      question4: false,
      question5: false,
    });
    setSelectedRadio('');
    setBookingId(0);
    setIsDialogVisible(false);
  };
  const handleRadioSelect = value => {
    setSelectedRadio(value);
    if (askQuestion.question1 === true && value === 'No') {
      setAskQuestion({
        ...askQuestion,
        question1: false,
        question2: true,
      });
      setSelectedRadio('');
      return;
    } else if (askQuestion.question2 === true && value === 'No') {
      setAskQuestion({
        ...askQuestion,
        question2: false,
        question3: true,
      });
      setSelectedRadio('');
      return;
    } else if (askQuestion.question3 === true && value === 'yes') {
      setAskQuestion({
        ...askQuestion,
        question3: false,
        question4: true,
      });
      setSelectedRadio('');
      return;
    } else if (askQuestion.question4 === true) {
      setAskQuestion({
        ...askQuestion,
        question4: true,
      });
      return;
    }
  };

  const actionCheckSubmit = () => {
    setButtonLoading(true);
    console.log('this button was clicked', item);
    if (askQuestion.question3 || askQuestion.question4) {
      if (askQuestion.question4 && selectedRadio == 'yes') {
        setButtonLoading(false);
        closeActionDialog();
        return;
      }
      let data = {
        temperature: 'Passed',
        booking_day_request_id: bookingId,
        answer: 'yes',
      };
      monitorService
        .BookingReportActionCheck(token, data)
        .then(res => {
          console.log(res);
          todayReportData();
          closeActionDialog();
          setButtonLoading(false);
        })
        .catch(error => {
          console.log(error);
          setButtonLoading(false);
        });
    } else {
      setButtonLoading(false);
      closeActionDialog();
    }
  };

  useEffect(() => {
    todayReportData();
  }, []);
  const todayReportData = () => {
    monitorService
      .dashboard(token)
      .then(res => {
        console.log(res);
        setDashboardData(res?.data?.monitorBookingDayRequest);
        setDashboardDataBkp(res?.data?.monitorBookingDayRequest);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  };


  const incidentSubmit = newdata => {
    console.log('newData', newdata);
    setIsLoading(true)
    const data = new Object({
      booking_day_report_id: bookingId,
      location: newdata.location,
      time: selectedTime,
      rooms: newdata.rooms,
      is_external_involve: newdata.external,
      is_witness_involve: newdata.witness,
      witness_description: newdata.witness_description,
      students: newdata.students,
      description: newdata.incidentdescription,
    });
    monitorService
      .IncidentActivity(token, data)
      .then(res => {
        reset2();
        console.log('response', res);
        setMessage(res.data.message);
        setVisible3(true);
        hideModal2();
      })
      .catch(error => {
        console.log('error', error);
        reset2();
        setMessage('Something went wrong');
        setVisible3(true);
        hideModal2();
      }).finally(() => setIsLoading(false))
  };
  const getGeoLocation = () => {

    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation(position.coords);
        console.log(latitude, longitude, "latlong");
      },
      error => {
        console.error(error.message);
      },
      Platform.OS === 'android' ? { enableHighAccuracy: true }  : { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };
  const arrivedMarked = async (data) => {
    setIsLoading(true);
    Geolocation.requestAuthorization();

    if (Platform.OS === 'android') {
      const checkEnabled = await isLocationEnabled();
      console.log('checkEnabled', checkEnabled);

      if (!checkEnabled) {
        console.error('Location services are not enabled.');
        setIsLoading(false);
        return;
      }
    }

    let locationObtained = false;

    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation(position.coords);
      console.log(latitude, longitude);
      const item = {
        booking_day_request_id: data.id,
        lat: latitude,
        lng: longitude
      };
      apiArrived(item);
      locationObtained = true;
    };

    const onError = (error) => {
      console.error(error.message);
      setIsLoading(false);
      if (!locationObtained) {
        console.error('Failed to obtain location.');
      }
    };

    Geolocation.getCurrentPosition(onSuccess, onError,
      Platform.OS === 'android' ? { enableHighAccuracy: true, } : {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      });
  };


  const apiArrived = (item) => {
    console.log(item, "here item ")
    monitorService
      .markArrived(token, item)
      .then(res => {
        console.log(res);
        todayReportData();
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  }
  const updateFinalSubmit = async (data) => {
    setIsLoading(true);
    Geolocation.requestAuthorization();

    if (Platform.OS === 'android') {
      const checkEnabled = await isLocationEnabled();
      console.log('checkEnabled', checkEnabled);

      if (!checkEnabled) {
        console.error('Location services are not enabled.');
        setIsLoading(false);
        return;
      }
    }

    let locationObtained = false;

    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation(position.coords);
      console.log(latitude, longitude);
      const data = new Object({
        Monitor_Booking_Day_Report_Id: item.monitor_booking_day_report.id,
        requestbody: { latlng: (latitude + ',' + longitude) },
      });
      apiMonitorSubmit(data)
      locationObtained = true;
    };

    const onError = (error) => {
      console.error(error.message);
      setIsLoading(false);
      if (!locationObtained) {
        console.error('Failed to obtain location.');
      }
    };

    Geolocation.getCurrentPosition(onSuccess, onError,
      Platform.OS === 'android' ? { enableHighAccuracy: true, } : {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      });
  };
  const apiMonitorSubmit = (data) => {
    console.log(data, "submitted data ")
    monitorService
      .MonitorSubmitReport(token, data)
      .then(res => {
        console.log('res', res);
        todayReportData();
        setMessage(res.data.message);
        setVisible3(true);
        setItem();
        hideModal4();
      })
      .catch(error => {
        console.log('error', error);
        // setMessage('Added successfully');
        // setVisible3(true);
        setItem();
        hideModal4();
      }).finally(() => setIsLoading(false))
  };


  async function handleEnabledPressed() {
    if (Platform.OS === 'android') {
      try {
        const enableResult = await promptForEnableLocationIfNeeded();

      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        }
      }
    }
  }


  return (
    <>
      <View
        style={{ flex: 1 }}>

        <FlatList
          style={styles.container}
          data={[{ key: 'header' }, ...dashboardData]}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => {
            // console.log(item, 'testv ')
            if (index === 0) {
              return (
                <>
                  <Text style={globalStyles.subtitle}>Today's Booking</Text>
                  <Divider style={globalStyles.divider} />
                  <View style={styles.container}>
                    <TodayFilterSearch
                      dashboardDataBkp={dashboardDataBkp}
                      setDashboardData={setDashboardData}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      sortDirections={sortDirections}
                      setSortDirections={setSortDirections}
                      dashboardData={dashboardData}
                    />
                    {dashboardData && dashboardData.length == 0 && (
                      <NoDataFound />
                    )}
                    {/* <Button

                  mode="contained"
                  onPress={() => arrivedMarked({id : 520})}>
                  Submit
                </Button> */}
                  </View>
                </>
              );
            } else {
              if (
                item?.monitor_booking_day_report &&
                item.monitor_booking_day_report?.end_time !== null
              ) {
                return;
              }
              return (
                <TodayBookingCardList
                  item={item}
                  checkActive={checkActive}
                  openPrecheckDialog={openPrecheckDialog}
                  openActionDialog={openActionDialog}
                  navigation={navigation}
                  ArrivedMarked={arrivedMarked}
                />
              );
            }
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={AppStyles.color.tint}
            />
          }
          ListEmptyComponent={
            !dashboardData?.length && !isLoading && (<NoDataFound />)
          }
        />
        <Portal>
          <Dialog visible={isDialogVisible} onDismiss={closeActionDialog}>
            <Dialog.Title>Wellness Check{ }</Dialog.Title>
            <Dialog.Content>
              {askQuestion.question1 === true && (
                <View>
                  <Text>
                    Within the last 10 days have you been diagnosed with
                    COVID-19 or had a test confirming you have the virus?
                  </Text>
                  <RadioButton.Group
                    onValueChange={handleRadioSelect}
                    value={selectedRadio}>
                    <RadioButton.Item label="yes" value="yes" />
                    <RadioButton.Item label="No" value="No" />
                  </RadioButton.Group>
                  <HelperText
                    type="error"
                    visible={selectedRadio == 'yes' ? true : false}>
                    Please contact the Night Auditor on duty
                  </HelperText>
                </View>
              )}
              {askQuestion.question2 === true && (
                <View>
                  <Text>
                    Do you live in the same household with, or have you had
                    close contact with someone who in the past 14 days has been
                    in isolation for COVID-19 or had a test confirming they have
                    the virus?
                  </Text>
                  <RadioButton.Group
                    onValueChange={handleRadioSelect}
                    value={selectedRadio}>
                    <RadioButton.Item label="yes" value="yes" />
                    <RadioButton.Item label="No" value="No" />
                  </RadioButton.Group>
                  <HelperText
                    type="error"
                    visible={selectedRadio == 'yes' ? true : false}>
                    Please contact the Night Auditor on duty
                  </HelperText>
                </View>
              )}
              {askQuestion.question3 === true && (
                <View>
                  <Text>
                    Have you experienced any of these symptoms today or within
                    the past 24 hours, which is new or not explained by another
                    reason?
                  </Text>
                  <Text>Fever, chills, or repeated shaking/shivering</Text>
                  <Text> Cough</Text>
                  <Text> Shortness of breath or difficulty breathing</Text>
                  <Text> Feeling unusually weak or fatigue</Text>
                  <Text> Muscle or body aches</Text>
                  <Text> Headache</Text>
                  <Text> Loss of taste or smell</Text>
                  <Text> Sore throat</Text>
                  <Text> Congestion or runny nose</Text>
                  <Text> Nausea or vomiting</Text>
                  <Text> Diarrhea</Text>
                  <RadioButton.Group
                    onValueChange={handleRadioSelect}
                    value={selectedRadio}>
                    <RadioButton.Item label="yes" value="yes" />
                    <RadioButton.Item label="No" value="No" />
                  </RadioButton.Group>
                  <HelperText
                    type="error"
                    visible={selectedRadio == 'No' ? true : false}>
                    Symptoms & Exposure: Passed, Click Submit button to continue
                  </HelperText>
                </View>
              )}
              {askQuestion.question4 === true && (
                <View>
                  <Text>
                    Are all of the symptoms you're experiencing related to a
                    known chronic condition?
                  </Text>
                  <RadioButton.Group
                    onValueChange={handleRadioSelect}
                    value={selectedRadio}>
                    <RadioButton.Item label="yes" value="yes" />
                    <RadioButton.Item label="No" value="No" />
                  </RadioButton.Group>
                  <HelperText
                    type="error"
                    visible={selectedRadio == 'yes' ? true : false}>
                    Please contact the Night Auditor on duty
                  </HelperText>
                  <HelperText
                    type="error"
                    visible={selectedRadio == 'No' ? true : false}>
                    Symptoms & Exposure: Passed, Click Submit button to continue
                  </HelperText>
                </View>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              {selectedRadio && (
                <Button
                  loading={buttonLoading}
                  mode="contained"
                  onPress={() => actionCheckSubmit()}>
                  Submit
                </Button>
              )}
              <Button mode="contained" onPress={() => closeActionDialog()}>
                Cancel
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog visible={visible} onDismiss={hideModal}>
            <View
              style={{
                ...styles.rowView,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Dialog.Title style={globalStyles.subtitle}>
                PreCheck Check
              </Dialog.Title>
              <Icon
                color={AppStyles.color?.tint}
                style={globalStyles.rightImageIcon}
                name="close"
                size={20}
                onPress={hideModal}
              />
            </View>
            <Dialog.Content>
              <View style={{ marginTop: 15, minHeight: 36 }}>
                <Text style={{ fontWeight: '700' }}>
                  {precheckQuestions[next]?.question}
                </Text>
              </View>
              <View style={{ marginTop: 15 }}>
                <View style={{ marginLeft: 10 }}>
                  <FormTextInput
                    control={control}
                    errors={errors}
                    name="first_name"
                    label="Description"
                    style={{ backgroundColor: 'transparent', width: '100%' }}
                  />
                </View>
                <FormRadioButtons
                  control={control}
                  name="preference"
                  label="Preference"
                  options={[
                    { label: 'Yes', value: 'Yes' },
                    { label: 'No', value: 'No' },
                  ]}
                  radioButton={radioButton}
                  setRadio={setRadio}
                  errors={errors}
                />
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              {next != precheckQuestions.length - 1 ? (
                <Button
                  textColor={AppStyles.color.white}
                  buttonColor={AppStyles.color.tint}
                  mode="contained-tonal"
                  style={styles.buttonStyle}
                  onPress={handleSubmit(handleNext)}>
                  Next
                </Button>
              ) : (
                <Button
                  textColor={AppStyles.color.white}
                  buttonColor={AppStyles.color.tint}
                  mode="contained-tonal"
                  style={styles.buttonStyle}
                  onPress={handleSubmit(handleNext)}>
                  Submit
                </Button>
              )}
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog visible={visible1} onDismiss={hideModal1}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  ...styles.rowView,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Dialog.Title style={globalStyles.subtitle}>
                  Add New Activity
                </Dialog.Title>
                <View style={{ marginTop: 10 }}>
                  <Icon
                    color={AppStyles.color?.tint}
                    style={globalStyles.rightImageIcon}
                    name="close"
                    size={20}
                    onPress={hideModal1}
                  />
                </View>
              </View>
              <Dialog.Content>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 20,
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    Start Time
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }}>End Time</Text>
                </View>
                <View
                  style={{
                    minHeight: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Button
                    textColor={AppStyles.color.white}
                    buttonColor={AppStyles.color.tint}
                    mode="contained-tonal"
                    style={{ width: 130 }}
                    onPress={() => {
                      showTimePicker();
                    }}>
                    {selectedTime}
                  </Button>
                  <Button
                    textColor={AppStyles.color.white}
                    buttonColor={AppStyles.color.tint}
                    mode="contained-tonal"
                    style={{ width: 130 }}
                    onPress={() => {
                      showTimeLastPicker();
                    }}>
                    {selectedTimeLast}
                  </Button>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 50,
                  }}>
                  <HelperText>
                    <Text>Minimum 1/2 Hours Required</Text>
                  </HelperText>
                </View>
                <View style={{ marginTop: 15 }}>
                  <View style={{ marginLeft: 20, minHeight: 40 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                      Description
                    </Text>
                  </View>
                  <View>
                    <TextInput
                      style={{ height: 100, borderRadius: 20 }}
                      onChangeText={e => setDescriptionActivity(e)}
                      underlineColor="transparent"
                      placeholder="description"
                    />
                  </View>
                </View>
                <HelperText style={{ minHeight: 40 }} visible={helper}>
                  <HelperText type="error">This field is required</HelperText>
                </HelperText>
              </Dialog.Content>
              <Dialog.Actions
                style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Button
                  textColor={AppStyles.color.white}
                  buttonColor={AppStyles.color.tint}
                  mode="contained-tonal"
                  style={styles.buttonStyle}
                  onPress={handleActivitySubmit}>
                  Submit
                </Button>
              </Dialog.Actions>
            </ScrollView>
          </Dialog>
        </Portal>
        <IncidentModel
          visibleModel={visible2}
          hideModal={hideModal2}
          handleSubmit2={handleSubmit2}
          incidentSubmit={incidentSubmit}
          control2={control2}
          errors2={errors2}
          setTimePickerVisibility={setTimePickerVisibility}
          selectedTime={selectedTime} />
        <Portal>
          <Portal>
            <Dialog visible={visible4} onDismiss={hideModal4}>
              <Dialog.Title>Are you Sure?</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  Submitting this report closes the job for the night.
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 25,
                  }}>
                  <Button
                    textColor={AppStyles.color.white}
                    buttonColor={AppStyles.color.tint}
                    mode="contained-tonal"
                    style={styles.buttonStyle}
                    onPress={updateFinalSubmit}>
                    Yes
                  </Button>
                  <Button
                    textColor={AppStyles.color.black}
                    buttonColor={AppStyles.color.white}
                    mode="contained-tonal"
                    style={styles.buttonStyle}
                    onPress={hideModal4}>
                    No
                  </Button>
                </View>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </Portal>
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          value={new Date()}
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
        <DateTimePickerModal
          isVisible={isTimePickerVisibleLast}
          mode="time"
          value={new Date()}
          onConfirm={handleTimeLastConfirm}
          onCancel={hideTimeLastPicker}
        />
        {isLoading && (
          <Portal>
            <LoadingContainer />
          </Portal>
        )}
        <Snackbar
          visible={visible3}
          onDismiss={() => setVisible3(false)}
          duration={3000}>
          {Message}
        </Snackbar>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: Configuration.home.listing_item.offset,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: AppStyles.color.title,
    marginBottom: 20,
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  surface: {
    padding: 8,
    height: 200,
    width: '47%', // Adjust the width as needed
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  model: {
    backgroundColor: 'white',
    padding: 20,
  },
});

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token,
});
const mapDispatchToProps = dispatch => ({
  unreadCount: (id) => dispatch(unreadCount(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

