/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Pressable} from 'react-native';
import {
  Portal,
  Dialog,
  Button,
  Text,
  DataTable,
  Divider,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {AppStyles} from '../utils/AppStyles';
import {monitorService} from '../utils/_services';
import {routeValue} from '../redux/actions/authActions';
import {formatDate, formatTime} from '../utils/_helpers';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingContainer from '../components/LoadingContainer';
import globalStyles from '../utils/_css/globalStyle';
import SearchBox from '../components/SearchBox';
import SubReportCardList from '../components/cards/SubReportCardList';
import SubReportFilterSearch from '../components/searchFilter/SubReportFilterSearch';

function SubReports({navigation, user, token, route, value}) {
  const [subReport, setSubReportData] = useState([]);
  const [subReportBkp, setSubReportDataBkp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, subReport?.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    monitorService
      .reportDetails(token, value.id)
      .then(res => {
        console.log(res, res?.data?.data);
        setSubReportData(res?.data?.data);
        setSubReportDataBkp(res?.data?.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const navigateDetails = booking => {
    // route(booking?.id);
    navigation.navigate('DetailsReport', {Booking: booking, header: 'report'});
    console.log(booking);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={globalStyles.subtitle}> Sub-Reports</Text>
        <Divider style={globalStyles.divider} />
        <View style={styles.container}>
          <SubReportFilterSearch
            subReport={subReport}
            setSubReportData={setSubReportData}
            subReportBkp={subReportBkp}
          />
          {subReport &&
            subReport?.map((item, index) => (
              <SubReportCardList
                key={index}
                item={item}
                navigateDetails={navigateDetails}
              />
            ))}
          {!subReport?.length && !isLoading && (
            <Text style={globalStyles.emptyData}>Data not found</Text>
          )}
          {/* <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(subReport.length / itemsPerPage)}
                            onPageChange={(page) => setPage(page)}
                            label={`${from + 1}-${to} of ${subReport.length}`}
                            numberOfItemsPerPageList={numberOfItemsPerPageList}
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={onItemsPerPageChange}
                            showFastPaginationControls
                            selectPageDropdownLabel={'Rows per page'}
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
    backgroundColor: '#fff',
    paddingVertical: 5,
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
    marginHorizontal: 10, // Adjust the margin between each icon
  },
  iconGap: {
    width: 20, // Adjust the gap width as needed
  },
  hederGap: {
    width: 20,
  },
});

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token,
  value: state.auth.value,
});

export default connect(mapStateToProps)(SubReports);
