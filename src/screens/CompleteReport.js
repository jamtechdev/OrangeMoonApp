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
import {formatDate, sortingHelper} from '../utils/_helpers';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingContainer from '../components/LoadingContainer';
import globalStyles from '../utils/_css/globalStyle';
import SearchBox from '../components/SearchBox';
import CompleteFilterSearch from '../components/searchFilter/CompleteFilterSearch';
import CompleteCardList from '../components/cards/CompleteCardList';

function CompleteReport({navigation, user, token, route}) {
  const [completeData, setCompleteData] = useState([]);
  const [completeDataBkp, setCompleteDataBkp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, completeData?.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    monitorService
      .completedReport(token)
      .then(res => {
        setCompleteData(res?.data?.data);
        setCompleteDataBkp(res?.data?.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  }, [token]);

  const navigateDetails = booking => {
    route(booking);
    navigation.navigate({
      name: 'SubReport',
      params: {bookingId: booking},
    });
    console.log(booking, 'here my route ');
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        scrollIndicatorInsets={{top: 0, left: 0, bottom: 0, right: 0}}>
        <View style={styles.container}>
          <Text style={globalStyles.subtitle}> Reports</Text>
          <Divider style={globalStyles.divider} />
          <CompleteFilterSearch
            completeData={completeData}
            setCompleteData={setCompleteData}
            completeDataBkp={completeDataBkp}
          />
          {completeData &&
            completeData?.map((item, index) => (
              <CompleteCardList
                key={index}
                item={item}
                navigateDetails={navigateDetails}
              />
            ))}
          {!completeData?.length && !isLoading && (
            <Text style={globalStyles.emptyData}>Data not found</Text>
          )}
          {/* <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(completeData.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${completeData.length}`}
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
});
const mapDispatchToProps = dispatch => ({
  route: id => {
    dispatch(routeValue(id)), console.log(id, 'ghere');
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(CompleteReport);
