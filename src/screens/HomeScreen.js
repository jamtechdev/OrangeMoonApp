/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, FlatList} from 'react-native'; // Import View
import {connect} from 'react-redux';
import {AppStyles} from '../utils/AppStyles';
import {Configuration} from '../utils/Configuration';
import {monitorService} from '../utils/_services';
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
} from 'react-native-paper';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import {formatDate, formatTime, sortingHelper} from '../utils/_helpers';
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
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { RefreshControl } from 'react-native';
import FormRadioButtons from '../components/FormRadioButton';
import DateTimePickerModal from "react-native-modal-datetime-picker";

function HomeScreen({navigation, user, token}) {
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
    const [radioButton, setRadio] = useState(false)

    const [checked, setChecked] = React.useState('first');
    const [question, setQuestion] = useState([])
    const [precheckQuestions, setPrecheckQuestion] = useState([]);
    const [description, setDescription] = useState([])
    const [status, setStatus] = useState([])
    const [questionaire, setquestionaire] = useState([])
    const [selectedTime, setSelectedTime] = useState('12:00 AM')
    const [selectedTimeLast, setSelectTimeLast] = useState('1:30 PM')
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [isTimePickerVisibleLast, setTimePickerVisibilitylast] = useState(false)
    const [DescriptionActivity, setDescriptionActivity] = useState()
    const [helper, setHelpertext] = useState(false)
    const validationSchema = Yup.object().shape({
      first_name: Yup.string().required("Answer is required"),
      preference: Yup.string().required("Preference is required"),
      precheckquestions: Yup.string(),
      description: Yup.string()
    })
    const formOptions = {
      resolver: yupResolver(validationSchema), mode: 'onChange', defaultValues: {
        first_name: ""
      }
    };
    const showTimePicker = () => {
      setTimePickerVisibility(true);
    };
  
    const hideTimePicker = () => {
      setTimePickerVisibility(false);
    };
    const handleActivitySubmit = () => {
      console.log("Description activity", DescriptionActivity)
      if (DescriptionActivity.length === 0) {
        setHelpertext(true)
      } else {
        console.log('api')
        setHelpertext(false)
        const data = new Object({
          booking_day_report_id: bookingId,
          activity_lat: location != null ? location.latitude : null,
          activity_lng: location != null ? location.longitude : null,
          start_time: selectedTime,
          end_time: selectedTimeLast,
          description: DescriptionActivity
  
        })
        monitorService.bookingdayActivity(token, data).then(res => {
          console.log('res', res)
          hideModal1()
        }).catch((error) => {
          console.log(error)
          hideModal1()
        }
        )
      }
    }
    const handleTimeConfirm = (time) => {
      // console.log("A date has been picked: ", time);
      // console.log(moment(time).add(90, 'minutes').format('hh:mm a'));
      setSelectedTime(moment(time).format('hh:mm A'))
      setSelectTimeLast(moment(time).add(30, 'minutes').format('hh:mm A'))
      hideTimePicker();
    };
    //--------------------------------------------------------------------------
    const showTimeLastPicker = () => {
      setTimePickerVisibilitylast(true);
    };
  
    const hideTimeLastPicker = () => {
      setTimePickerVisibilitylast(false);
    };
  
    const handleTimeLastConfirm = (time) => {
      console.warn("A date has been picked: ", time);
      setSelectTimeLast(moment(time).format('hh:mm A'))
      setSelectedTime(moment(time).subtract(30, 'minutes').format('hh:mm A'))
      // const dt = new Date(time);
      // const x = dt.toLocaleTimeString()
      // console.log('time', x)
      // setSelectTimeLast(x)
      hideTimeLastPicker();
    };
    const { control, reset, handleSubmit, setValue, watch, formState: { errors } } = useForm(formOptions);
    const onSubmit = (data) => {
      // console.log("data are", data)
      setDescription([...description, data.first_name])
      setStatus([...status, data.preference])
      setquestionaire([...questionaire, precheckQuestions[next].question])
      reset()
      precheckpostApi()
      // setNext(0)
      // hideModal()
    }
    const [time, setTime] = useState({ hours: '12', minutes: '00' })
    const [visibleTime, setVisibleTime] = React.useState(false)
    const onDismiss = React.useCallback(() => {
      setVisibleTime(false)
    }, [setVisible])
  
    const isFocused = useIsFocused()
    useEffect(() => {
      todayReportData();
      getPrecheckData();
      getGeoLocation()
    }, [isFocused]);
    const getPrecheckData = () => {
      monitorService.precheckquestion(token).then(res => {
        setPrecheckQuestion(res?.data.questions)
      }).catch(error => {
        console.log(error)
        setIsLoading(false)
        navigation.navigate('LoginStack')
      })
    }
    const onConfirm = React.useCallback(
      ({ hours, minutes }) => {
        setVisibleTime(false);
        console.log({ hours, minutes });
        setTime({ hours: hours, minutes: minutes })
      },
      [setVisible]
    );
    const precheckpostApi = () => {
      // console.log("location",location)
      const data = new Object(
        {
          booking_day_report_id: bookingId,
          start_location_lat: location != null ? location.latitude : null,
          start_location_lng: location != null ? location.longitude : null,
          precheck_question: [questionaire],
          status: status,
          description: description
        }
      )
      monitorService.prechecksResponse(token, data).then(res => {
        console.log("response", res)
        setNext(0)
        hideModal()
        todayReportData();
      }).catch((error) => {
        console.log(error)
        setNext(0)
        hideModal()
      }
      )
    }
  
    const handleNext = (data, newdata) => {
      // console.log(precheckQuestions[next].question)
      setDescription([...description, data.first_name])
      setStatus([...status, data.preference])
      setquestionaire([...questionaire, precheckQuestions[next].question])
      setNext(next + 1)
      reset()
      setRadio(false)
      // console.log("data are", data)
    }

    const [visible, setVisible] = React.useState(false);
    const [visible1, setVisible1] = React.useState(false)
    const [visible2, setVisible2] = React.useState(false)
  
    const showModal = () => setVisible(true);
    const hideModal = () => {
      setNext(0)
      setDescription([])
      setStatus([])
      setquestionaire([])
      setVisible(false)
      reset()
    }
    const hideModal1 = () => {
      setVisible1(false)
    }
    const hideModal2 = () => {
      setVisible2(false)
    }
    const openPrecheckDialog = (item) => {
      setBookingId(item.monitor_booking_day_report.id);
      console.log(item, 'here my item data ')
      showModal()
    }




  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  const openActionDialog = (item) => {
    setBookingId(item.monitor_booking_day_report.id)
    console.log("item", item.monitor_booking_day_report.id)
    setVisible1(true)
    // setVisible2(true)
    // setBookingId(item.id);

    // // setIsDialogVisible(true);
    // console.log("items", !item?.monitor_booking_day_report && item?.booking_day?.date)
    // if (!item?.monitor_booking_day_report && item?.booking_day?.date <= checkActive(item)) {
    //   showModal()
    // } else if (item?.monitor_booking_day_report && item?.precheckCount > 0) {
    //   setVisible1(true)
    //   // navigation.navigate('TimeSelector')
    // } else {
    //   setIsDialogVisible(true);

    // }
  }
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
        ...sortDirections,
        question1: false,
        question2: true,
      });
      setSelectedRadio('');
      return;
    } else if (askQuestion.question2 === true && value === 'No') {
      setAskQuestion({
        ...sortDirections,
        question2: false,
        question3: true,
      });
      setSelectedRadio('');
      return;
    } else if (askQuestion.question3 === true && value === 'yes') {
      setAskQuestion({
        ...sortDirections,
        question3: false,
        question4: true,
      });
      setSelectedRadio('');
      return;
    } else if (askQuestion.question4 === true) {
      setAskQuestion({
        ...sortDirections,
        question4: true,
      });
      return;
    }
  };

  const actionCheckSubmit = () => {
    let data = {
      temperature: 'Passed',
      booking_day_request_id: bookingId,
      answer: 'no',
    };
    monitorService
      .BookingReportActionCheck(token, data)
      .then(res => {
        todayReportData();
      })
      .catch(error => {
        console.log(error);
      });
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

  // function isTimePastOrEqual(bookingStartTime) {
  //   const currentDateTime = new Date();
  //   return currentDateTime >= bookingStartTime;
  // }
  // const getShowButtonCheck = (monitorBookingDayRequest) => {
  //   const bookingStartTime = new Date(monitorBookingDayRequest.booking_day.date + ' ' + monitorBookingDayRequest.booking_day.start_time);
  //   const isActive = isTimePastOrEqual(bookingStartTime);
  //   return isActive;
  // }

  const getGeoLocation = () => {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation(position.coords);
        console.log(latitude, longitude);
      },
      error => {
        console.error(error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* <Text style={globalStyles.subtitle} onPress={() => getGeoLocation()}>Today's Booking</Text> */}
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
           <FlatList
            data={dashboardData?.slice(from, to)}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TodayBookingCardList
              item={item}
              openPrecheckDialog={openPrecheckDialog}
              openActionDialog={openActionDialog}
            />
            )}
          />
              {!dashboardData?.length && !isLoading && (
                <Text style={globalStyles.emptyData}> Data not found</Text>
              )}
              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(dashboardData.length / itemsPerPage)}
                onPageChange={page => setPage(page)}
                label={`${from + 1}-${to} of ${dashboardData.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                showFastPaginationControls
                selectPageDropdownLabel={'Rows per page'}
              />
          <Portal>
            <Dialog visible={isDialogVisible} onDismiss={closeActionDialog}>
              <Dialog.Title>Wellness Check{}</Dialog.Title>
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
                      close contact with someone who in the past 14 days has
                      been in isolation for COVID-19 or had a test confirming
                      they have the virus?
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
                      the past 24 hours, which is new or not explained by
                      another reason?
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
                      Symptoms & Exposure: Passed, Click Submit button to
                      continue
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
                      Symptoms & Exposure: Passed, Click Submit button to
                      continue
                    </HelperText>
                  </View>
                )}
              </Dialog.Content>
              <Dialog.Actions>
                {selectedRadio && (
                  <Button mode="contained" onPress={() => actionCheckSubmit()}>
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
            <View style={styles.rowView}>
              <Dialog.Title style={globalStyles.subtitle}>Wellness Check</Dialog.Title>
              <Icon color={AppStyles.color?.tint} style={globalStyles.rightImageIcon} name='close' size={20} onPress={hideModal} />
            </View>
            <Dialog.Content>
              <View style={{ marginTop: 15, minHeight: 36 }}>
                <Text style={{ fontWeight: '700' }}>{precheckQuestions[next]?.question}</Text>
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
                  // Helpertext = {data[next].HelpText}
                  radioButton={radioButton}
                  setRadio={setRadio}
                  errors={errors}
                />
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              {next != precheckQuestions.length - 1 ? (
                <Button textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" style={styles.buttonStyle} onPress={handleSubmit(handleNext)}>
                  Next
                </Button>
              ) : (
                <Button textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" style={styles.buttonStyle} onPress={handleSubmit(onSubmit)}>
                  Submit
                </Button>
              )}
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog visible={visible1} onDismiss={hideModal1}>
            <View style={styles.rowView}>
              <Dialog.Title style={globalStyles.subtitle}>Add New Activity</Dialog.Title>
              <Icon color={AppStyles.color?.tint} style={globalStyles.rightImageIcon} name='close' size={20} onPress={hideModal1} />
            </View>
            <Dialog.Content>
              <View style={{ flexDirection: 'row', padding: 20, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', }}>Start Date</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', }}>End Date</Text>
              </View>
              <View style={{ minHeight: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" style={{ width: 130 }} onPress={() => { showTimePicker() }}>
                  {selectedTime}
                </Button>
                <Button textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" style={{ width: 130 }} onPress={() => { showTimeLastPicker() }}>
                  {selectedTimeLast}
                </Button>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 50 }}>
                <HelperText>
                  <Text>Minimum 1/2 Hours Required</Text>
                </HelperText>
              </View>
              <View style={{ marginTop: 15 }}>
                <View style={{ marginLeft: 20, minHeight: 40 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', }}>Description</Text>
                </View>
                <View>
                  <TextInput style={{ height: 100, borderRadius: 20 }} onChangeText={(e) => setDescriptionActivity(e)} underlineColor="transparent" placeholder='description' />
                </View>
              </View>
              <HelperText style={{ minHeight: 40 }} visible={helper}>
                <HelperText type="error">This field is required</HelperText>
              </HelperText>
            </Dialog.Content>
            <Dialog.Actions style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Button textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" style={styles.buttonStyle} onPress={handleActivitySubmit}>
                Submit
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog visible={visible2} onDismiss={hideModal2}>
            <View style={styles.rowView}>
              <Dialog.Title style={globalStyles.subtitle}>Incident</Dialog.Title>
              <Icon color={AppStyles.color?.tint} style={globalStyles.rightImageIcon} name='close' size={20} onPress={hideModal2} />
            </View>
            <Dialog.Content style={{ minHeight: 500 }}>
              <ScrollView style={{ ...globalStyles.cardContainer, minHeight: 90, paddingHorizontal: 0, paddingVertical: 0, backgroundColor: 'transparent' }} nestedScrollEnabled={true}>
                <Card style={{ ...globalStyles.card }} mode='contained' >
                  <Card.Content>
                    <View style={styles.detailsContainer}>
                      <FormTextInput control={control} errors={errors} name="location" label="Location" />
                      <FormRadioButtons
                        control={control}
                        name="external"
                        label="Is External Involve"
                        options={[
                          { label: 'Yes', value: 'yes' },
                          { label: 'No', value: 'no' },
                        ]}
                        errors={errors}
                      />
                      <FormRadioButtons
                        control={control}
                        name="witness"
                        label="Is Witness Involve"
                        options={[
                          { label: 'Yes', value: 'yes' },
                          { label: 'No', value: 'no' },
                        ]}
                        errors={errors}
                      />
                      <FormTextInput control={control} errors={errors} name="description" label="Description" />
                      <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Time:</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', minHeight: 60 }}>
                        <View style={{ padding: 12 }}>
                          <Text style={{
                            fontSize: 16,
                            color: '#222',
                            fontWeight: '600',
                            paddingLeft: 10,
                            textAlign: 'left',
                            paddingBottom: 0,
                          }}>{time.hours}:{time.minutes}</Text>
                        </View>
                        <Button onPress={() => setVisibleTime(true)} uppercase={false} mode="outlined">
                          Pick time
                        </Button>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Divider style={globalStyles.divider} />
                      </View>

                      <FormTextInput control={control} errors={errors} name="witness_description" label="Witness Description" />
                      <FormTextInput control={control} errors={errors} name="students" label="Students" />
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" style={styles.buttonStyle}>
                          Submit
                        </Button>
                        <Button textColor={AppStyles.color.black} buttonColor={AppStyles.color.white} mode="contained-tonal" style={styles.buttonStyle} onPress={() => navigation.navigate('Home')}>
                          Back
                        </Button>
                      </View>

                    </View>
                  </Card.Content>

                </Card>
              </ScrollView>
            </Dialog.Content>
          </Dialog>
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
        {/* <TimePickerModal
          visible={visibleTime}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={12}
          minutes={14}
        /> */}


        </View>
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

export default connect(mapStateToProps)(HomeScreen);
