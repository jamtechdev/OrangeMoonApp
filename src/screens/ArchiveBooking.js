/* eslint-disable prettier/prettier */
import React, {useLayoutEffect, useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, RefreshControl, Text} from 'react-native';
import {List, Divider, Chip, Portal, DataTable} from 'react-native-paper';
import {connect} from 'react-redux';
import {monitorService} from '../utils/_services';
import {AppStyles} from '../utils/AppStyles';
import globalStyles from '../utils/_css/globalStyle';
import {formatDate, sortingHelper} from '../utils/_helpers';
import LoadingContainer from '../components/LoadingContainer';
import SearchBox from '../components/SearchBox';
import ArchiveFilterSearch from '../components/searchFilter/ArchiveFilterSearch';
import ArchiveCardList from '../components/cards/ArchiveCardList';
import NoDataFound from '../components/NoData';

function ArchiveBooking({navigation, user, token, route}) {
  const [archiveData, setArchiveData] = useState([]);
  const [archiveDataBkp, setArchiveDataBkp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, archiveData?.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    monitorArchiving();
  }, [token]);

  const monitorArchiving=()=>{
    monitorService
    .archivesBooking(token)
    .then(res => {
      console.log(res, 'here my console res');
      setArchiveData(res?.data?.data);
      setArchiveDataBkp(res?.data?.data);
      setIsLoading(false);
    })
    .catch(error => {
      console.log(error);
      setIsLoading(false);
    }).finally(() => {
      setRefreshing(false);
    });
  }
  const handleRefresh = () => {
    setRefreshing(true);
    monitorArchiving();
  }

  return (
    <>
      <ScrollView style={styles.container}
      refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={AppStyles.color.tint}
    />
  }
  showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={globalStyles.subtitle}> Archiving Bookings</Text>
          <Divider style={globalStyles.divider} />

          <ArchiveFilterSearch
            archiveData={archiveData}
            setArchiveData={setArchiveData}
            archiveDataBkp={archiveDataBkp}
          />

          {archiveData?.map((item, index) => (
            <ArchiveCardList item={item} key={index} />
          ))}
          {!archiveData?.length && !isLoading && (
                <NoDataFound />
          )}
          {/* <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(archiveData.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${archiveData.length}`}
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
  Searchbar: {
    marginTop: 10,
  },
});

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(mapStateToProps)(ArchiveBooking);
