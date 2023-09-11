/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { List, Card, Button, Divider, Snackbar, Searchbar, DataTable , Portal, Modal, Dialog} from 'react-native-paper';
import { connect } from 'react-redux';
import { monitorService } from '../utils/_services';
import { AppStyles } from '../utils/AppStyles';
import globalStyles from '../utils/_css/globalStyle';
import LoadingContainer from '../components/LoadingContainer';
import { formatDate } from '../utils/_helpers';
import { Calendar } from 'react-native-big-calendar';
import Icon from 'react-native-vector-icons/FontAwesome'
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from '@react-native-community/datetimepicker';
import FormDateInput from '../components/FormDateInput';

function Scheduling({ navigation, user, token, route }) {
  const [eventData, setEventData] = useState([])
  const [archiveData, setArchiveData] = useState([])
  const [archiveDataBkp, setArchiveDataBkp] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [visibleToast, setVisibleToast] = useState(false);
  const [visibleModel, setVisibleModel] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
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

  const { control, handleSubmit, setValue, watch, formState: { errors } }  = useForm()


  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, archiveData?.length);
  const showModal = () => setVisibleModel(true);
  const hideModal = () => setVisibleModel(false);
  const hideDialog = () =>setVisibleDialog(false);
  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    monitorService.getAllSchedulingEvent(token).then(res => {
      console.log(res.data?.monitor_availability[0], "here my console res");
      for (const item of res.data.monitor_availability) {
        const date = new Date(item.date);
        item.start = date;
        item.end = date;
      }
      setEventData(res.data?.monitor_availability)
      setIsLoading(false);
    }).catch(error => {
      console.log(error);
      setIsLoading(false);
    });
    // monitorService.archivesBooking(token).then(res => {
    //   // console.log(res, "here my console res");
    //   setArchiveData(res?.data?.data);
    //   setArchiveDataBkp(res?.data?.data);
    //   setIsLoading(false);
    // }).catch(error => {
    //   console.log(error);
    //   setIsLoading(false);
    // });
  }, [token]);

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
        case 'object':
          return nextSortDirection === 'ascending' ? aValue?.getTime() - bValue?.getTime() : bValue?.getTime() - aValue?.getTime();
        default:
          return 0;
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
  const onChangeDate = (newDates) => {
    const newDate = newDates[0];
    setSelectedDate(newDate);
  };
  const eventStyleGetter = (event, start, end, isSelected) => {
    return  {
      backgroundColor: event.color,
      borderRadius: 5,
      opacity: 0.8,
      color: AppStyles.color.black,
      border: '3px solid black',
    };
  };

  const CustomEvent = ({ event , touchableOpacityProps}) => (
    <Pressable {...touchableOpacityProps} onPress={() => onEventPress(event)} style={[styles.customEventContainer, { backgroundColor: event.color }]}>
      <Text style={styles.eventText}>{event.title}</Text>
    </Pressable>
  );
  const onEventPress = (event) => {
    const eventDate = new Date(event.date);
    const currentDate = new Date();
    if(event.status === "OFFERED" || event.status === "BOOKED" ){
      setVisibleModel(true)
      return;
    } else if( event.status === "AVAILABLE"){
      setVisibleToast(true)
      return;
    }
    else if (eventDate >= currentDate.setHours(0, 0, 0, 0) && event.status === "NOT AVAILABLE") {
      setVisibleDialog(true)
      return;
    } else {
      setVisibleToast(true)
    }
  };
  const bookingDayDetails= [];

  return (
    <>
    <ScrollView style={styles.container} scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 0 }}>
      <View style={styles.container}>
        <Text style={globalStyles.subtitle}> Manage Schedule </Text>
        <Divider style={globalStyles.divider} />
        <View style={styles.dateView}>
          <Button title="Today" onPress={goToToday} ><Text style={styles.todayButton}> Today</Text></Button>
          <Text style={styles.monthText}>
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <View style={styles.iconView}>
            <Icon color={AppStyles.color?.tint} style={styles.dateIcon} name='angle-left' size={30} onPress={goToPreviousMonth} />
            <Icon color={AppStyles.color?.tint} style={styles.dateIcon} name='angle-right' size={30} onPress={goToNextMonth} />
          </View>
        </View>
        <Calendar
          events={eventData || []}
          mode='month'
          height={400}
          date={selectedDate}
          showAllDayEventCell={true}
          onChangeDate={onChangeDate}
          eventCellStyle={eventStyleGetter}
          renderEvent={(event, touchableOpacityProps) => (
              <CustomEvent event={event} touchableOpacityProps={touchableOpacityProps}/>
        )}
          onPressDateHeader={(e) => console.log('onPressDateHeader date here ', e)}
          onPressCell={(e) => console.log('onPressCell date here ', e)}
          onPressEvent={(e) => console.log('onPressEvent date here ', e)}
        />

        <View style={styles.nextDiv}>
          <Text style={globalStyles.subtitle}> Open Assignments</Text>
          <Divider style={globalStyles.divider} />
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
                <DataTable.Title sortDirection={sortDirections.group_name} onPress={() => handleSort('group_name')} style={styles.headerCell}> Group Name </DataTable.Title>
                <DataTable.Title sortDirection={sortDirections.start_date} onPress={() => handleSort('start_date')}>Start Date </DataTable.Title>
                <DataTable.Title sortDirection={sortDirections.end_date} onPress={() => handleSort('end_date')}> End Date  </DataTable.Title>
                <DataTable.Title sortDirection={sortDirections.status} onPress={() => handleSort('status')}>Status </DataTable.Title>
              </DataTable.Header>
              {isLoading && (<LoadingContainer />)}
              {archiveData?.slice(from, to).map((item) => (
                <DataTable.Row key={item.id} >
                  <DataTable.Cell >{item.id} </DataTable.Cell>
                  <DataTable.Cell style={styles.cell} >{item.booking.group_name}</DataTable.Cell>
                  <DataTable.Cell >{formatDate(item.booking.start_date)} </DataTable.Cell>
                  <DataTable.Cell >{formatDate(item.booking.end_date)} </DataTable.Cell>
                  <DataTable.Cell > {item?.status} </DataTable.Cell>
                </DataTable.Row>
              ))}
              {!archiveData?.length && !isLoading && (<Text style={globalStyles.emptyData}> Data not found</Text>)}
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
      </View>
    </ScrollView>
    <Snackbar
          visible={visibleToast}
          onDismiss={() => setVisibleToast(false)}
          duration={1000}
        >
     Not a valid date, Click on another date  
        </Snackbar>
        <Portal>
        <Dialog visible={visibleDialog} onDismiss={hideDialog}>
        <View style={styles.rowView}>
            <Dialog.Title style={globalStyles.subtitle}>Scheduling</Dialog.Title>
            <Icon color={AppStyles.color?.tint} style={globalStyles.rightImageIcon} name='close' size={20} onPress={hideDialog} />
        </View>
            <Divider style={globalStyles.divider} />
            <Dialog.Content>
            <View style={styles.input}>
            <FormDateInput control={control} name="start_Date" label="Start Date" setValue={setValue} errors={errors}  />
            <FormDateInput control={control} name="end_Date" label="End Date" setValue={setValue} errors={errors}  />
            </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>NOT AVAILABLE </Button>
              <Button textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" style={styles.buttonStyle} onPress={hideDialog}>AVAILABLE</Button>
            </Dialog.Actions>
          </Dialog>
      </Portal>
      <Portal>
      <Modal visible={visibleModel} onDismiss={hideModal} contentContainerStyle={styles.modalView}>
      <ScrollView >
      <View style={styles.container}>
      <View style={styles.rowView}>
        <Text style={globalStyles.subtitle}>Reservation Details</Text>
        <Icon color={AppStyles.color?.tint} style={[globalStyles.rightImageIcon, styles.closeIcon]} name='close' size={20} onPress={hideModal} />
      </View>
        <Divider style={globalStyles.divider} />
      <View style={styles.accountDetailsContainer}>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Group Name :</Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.temperature || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Number Of Students:</Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.no_of_students || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Floor: </Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.date || '-'} </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >TD/GL Name: </Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.temperature || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >TD/GL Contact No: </Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.group_name || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Start Date: </Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.no_of_floor || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >End Date:</Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.gl_name || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Start Time: </Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.gl_phone || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >End Time: </Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.start_time || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Hotel Name:</Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.end_time || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Hotel Address: </Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.start_location_addr || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Hotel Phone:</Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.end_location_addr || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Hotel State:</Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.end_location_addr || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Hotel City:</Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.end_location_addr || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Hotel Zipcode:</Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.end_location_addr || '-'}  </Text>
                                        </View>
                                        <View style={styles.detailRow} >
                                            <Text style={styles.keyText} >Location:</Text>
                                            <Text style={styles.valueText}>{bookingDayDetails?.end_location_addr || '-'}  </Text>
                                        </View>
                                    </View>
                                    <Divider style={globalStyles.divider} />
                                    <Button onPress={hideModal}> Cancel </Button>
                                    </View>
                                    </ScrollView>
        </Modal>
      </Portal>
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
  Searchbar: {
    marginTop: 10,
  },
  nextDiv: {
    marginVertical: 15,
  },
  dateView:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
   },
   todayButton :{
      color: AppStyles.color?.tint,
      fontWeight: '700', 
   },
   monthText:{
    textAlign: 'center',
    color: AppStyles.color?.black,
    fontWeight: '700',
   },
   iconView:{
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   dateIcon:{
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
    color: AppStyles.color.black,
    fontSize: 8,
    fontWeight: '600',
  },
  input:{
  marginTop:15,
  },
  buttonStyle: {
  paddingHorizontal : 15,
  },
  rowView:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountDetailsContainer: {
    marginTop: 10,
},
modalView:{
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
    fontSize: 12
},
valueText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12
},
closeIcon :{
  right: 0,
  top: 15
}
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
});


export default connect(mapStateToProps)(Scheduling);