/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native'; // Import View
import { connect } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';
import { monitorService } from '../utils/_services';
import { Divider, Text, Portal, Button, Dialog, RadioButton, DataTable, Searchbar, HelperText } from 'react-native-paper';
import { formatDate, formatTime, sortingHelper } from '../utils/_helpers';
import globalStyles from '../utils/_css/globalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingContainer from '../components/LoadingContainer';
function HomeScreen({ navigation, user, token }) {
  const [dashboardData, setDashboardData] = useState([])
  const [dashboardDataBkp, setDashboardDataBkp] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirections, setSortDirections] = useState({
    group_name: 'none',
    date: 'none',
    start_time: 'none',
    end_time: 'none',
    status: 'none',
  });
  const [askQuestion, setAskQuestion] = useState(
    {
      question1: true, value1: '',
      question2: false, value2: '',
      question3: false, value3: '',
      question4: false, value4: '',
    }
  );
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState();
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, dashboardData?.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  const toggleDialog = () => {
    setIsDialogVisible(!isDialogVisible);
  };
  const handleRadioSelect = (value) => {
    setSelectedRadio(value);
    console.log(value)
    console.log
    if (askQuestion.question1 === true && value === 'No') {
      setAskQuestion({
        ...sortDirections,
        question1: false,
        value1: value,
        question2: true
      });
      setSelectedRadio('')
    } else if (askQuestion.question2 === true && value === 'No') {
      setAskQuestion({
        ...sortDirections,
        question2: false,
        value2: value,
        question3: true
      });
      setSelectedRadio('')
    } else if (askQuestion.question3 === true && value === 'yes') {
      setAskQuestion({
        ...sortDirections,
        question3: false,
        value3: value,
        question4: true
      });
      setSelectedRadio('')
    } else if (askQuestion.question4 === true) {
      setAskQuestion({
        ...sortDirections,
        question4: true,
        value4: value,
      });
    }
  };

  useEffect(() => {
    monitorService.dashboard(token).then(res => {
      setDashboardData(res?.data?.monitorBookingDayRequest)
      setDashboardDataBkp(res?.data?.monitorBookingDayRequest)
      setIsLoading(false)
    }).catch(error => {
      console.log(error);
      setIsLoading(false)
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
    let sortDataType = '';
    const sortedData = [...dashboardData].sort((a, b) => {
      let aValue = '';
      let bValue = '';
      if (columnKey == 'group_name') {
        sortDataType = typeof dashboardData[0]?.booking_day?.booking?.group_name
        aValue = a?.booking_day?.booking?.group_name;
        bValue = b?.booking_day?.booking?.group_name;
      } else if (columnKey == 'status') {
        sortDataType = typeof dashboardData[0][columnKey]
        aValue = a?.status;
        bValue = b?.status;
      } else {
        sortDataType = typeof dashboardData[0]['booking_day'][columnKey]
        aValue = a?.booking_day[columnKey];
        bValue = b?.booking_day[columnKey];
      }
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
    console.log(sortDirections, columnKey, sortDataType, sortedData)
    setDashboardData(sortedData);
  };
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredData = dashboardDataBkp.filter((item) =>
      item?.booking_day?.booking?.group_name.toLowerCase().includes(lowerCaseQuery) ||
      formatDate(item?.booking_day?.date).includes(lowerCaseQuery) ||
      formatTime(item?.booking_day?.start_time).includes(lowerCaseQuery) ||
      formatTime(item?.booking_day?.end_time).includes(lowerCaseQuery) ||
      item?.status.toLowerCase().includes(lowerCaseQuery)
    );
    if (filteredData.length !== 0) {
      setDashboardData(filteredData)
    } else {
      setDashboardData(dashboardDataBkp)
    }
    console.log(filteredData, query)
    setSearchQuery(query);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.subtitle}>Today's Booking</Text>
      <Divider style={globalStyles.divider} />
      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          onChangeText={handleSearch}
          value={searchQuery}
        />
        <ScrollView horizontal >
          <DataTable style={globalStyles.DataTable}>
            <DataTable.Header style={globalStyles.header}>
              <DataTable.Title sortDirection={sortDirections.group_name} onPress={() => handleSort('group_name')} style={globalStyles.headerCell}> Group Name </DataTable.Title>
              <DataTable.Title sortDirection={sortDirections.date} onPress={() => handleSort('date')} style={globalStyles.headerCellDate}> Date </DataTable.Title>
              <DataTable.Title sortDirection={sortDirections.start_time} onPress={() => handleSort('start_time')} style={globalStyles.headerCellCommon}> Start Time {' '} </DataTable.Title>
              <DataTable.Title sortDirection={sortDirections.end_time} onPress={() => handleSort('end_time')} style={globalStyles.headerCellCommon}> End Time {' '}  </DataTable.Title>
              <DataTable.Title sortDirection={sortDirections.status} onPress={() => handleSort('status')} style={globalStyles.headerCellCommon}> Status </DataTable.Title>
              <DataTable.Title style={globalStyles.headerCellCommon}> Action </DataTable.Title>
            </DataTable.Header>
            {isLoading && (<LoadingContainer />)}
            {dashboardData.slice(from, to).map((item) => (
              <DataTable.Row key={item.id} >
                <DataTable.Cell style={globalStyles.cell} >{item?.booking_day?.booking?.group_name}</DataTable.Cell>
                <DataTable.Cell style={globalStyles.CellDate}> {formatDate(item?.booking_day?.date)} </DataTable.Cell>
                <DataTable.Cell >{formatTime(item?.booking_day?.start_time)}</DataTable.Cell>
                <DataTable.Cell >{formatTime(item?.booking_day?.end_time)}</DataTable.Cell>
                <DataTable.Cell >{item?.status}</DataTable.Cell>
                <DataTable.Cell > <Icon name='hospital-o' onPress={toggleDialog} size={20} color={AppStyles.color.tint} /> </DataTable.Cell>
              </DataTable.Row>
            ))}
            {!dashboardData?.length && !isLoading && (<Text style={globalStyles.emptyData}> Data not found</Text>)}
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(dashboardData.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${dashboardData.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
        </ScrollView>
        <Portal>
          <Dialog visible={isDialogVisible} onDismiss={toggleDialog}>
            <Dialog.Title>Wellness Check{ }</Dialog.Title>
            <Dialog.Content>
              {askQuestion.question1 === true && (
                <View>
                  <Text>Within the last 10 days have you been diagnosed with COVID-19 or had a test confirming you have the virus?</Text>
                  <RadioButton.Group onValueChange={handleRadioSelect} value={selectedRadio}>
                    <RadioButton.Item label="yes" value="yes" />
                    <RadioButton.Item label="No" value="No" />
                  </RadioButton.Group>
                  <HelperText type="error" visible={selectedRadio == 'yes' ? true : false}>
                    Please contact the Night Auditor on duty
                  </HelperText>
                </View>
              )}
              {askQuestion.question2 === true && (
                <View>
                  <Text>Do you live in the same household with, or have you had close contact with someone who in the past 14 days has been in isolation for COVID-19 or had a test confirming they have the virus?</Text>
                  <RadioButton.Group onValueChange={handleRadioSelect} value={selectedRadio}>
                    <RadioButton.Item label="yes" value="yes" />
                    <RadioButton.Item label="No" value="No" />
                  </RadioButton.Group>
                  <HelperText type="error" visible={selectedRadio == 'yes' ? true : false}>
                    Please contact the Night Auditor on duty
                  </HelperText>
                </View>
              )}
              {askQuestion.question3 === true && (
                <View>
                  <Text>Have you experienced any of these symptoms today or within the past 24 hours, which is new or not explained by another reason?</Text>
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
                  <RadioButton.Group onValueChange={handleRadioSelect} value={selectedRadio}>
                    <RadioButton.Item label="yes" value="yes" />
                    <RadioButton.Item label="No" value="No" />
                  </RadioButton.Group>
                  <HelperText type="error" visible={selectedRadio == 'No' ? true : false}>
                    Please contact the Night Auditor on duty
                  </HelperText>
                </View>
              )}
              {askQuestion.question4 === true && (
                <View>
                  <Text>Are all of the symptoms you're experiencing related to a known chronic condition?</Text>
                  <RadioButton.Group onValueChange={handleRadioSelect} value={selectedRadio}>
                    <RadioButton.Item label="yes" value="yes" />
                    <RadioButton.Item label="No" value="No" />
                  </RadioButton.Group>
                  <HelperText type="error" visible={selectedRadio ? true : false}>
                    Please contact the Night Auditor on duty
                  </HelperText>
                </View>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              {selectedRadio && (
                <Button mode="contained" onPress={toggleDialog}>Submit</Button>
              )}
              <Button mode="contained" onPress={toggleDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </ScrollView>
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppStyles.color.title,
    marginBottom: 5,
    marginTop: 5
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
    padding: 20
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(mapStateToProps)(HomeScreen);
