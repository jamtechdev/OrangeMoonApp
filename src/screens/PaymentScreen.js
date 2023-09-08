/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { Divider, Button, Text, DataTable } from 'react-native-paper';
import { connect } from 'react-redux';
import globalStyles from '../utils/_css/globalStyle';
import { AppStyles } from '../utils/AppStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { formatDate, formatTime, } from '../utils/_helpers';
import { stripeService } from '../utils/_services/stripeService';
import LoadingContainer from '../components/LoadingContainer';
function PaymentScreen({ navigation, user, token }) {
  const [stripeData, setStripeData] = useState([])
  const [stripeTableData, setStripeTableData] = useState([])
  const [stripeShowData, setStripeShowData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortDirections, setSortDirections] = useState({
    group_name: 'none',
    date: 'none',
    start_time: 'none',
    end_time: 'none',
  });
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, stripeTableData?.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  useEffect(() => {
    stripeService.checkStripeConnection(token).then(res => {
      setStripeData(res?.data?.stripe_connection)
      console.log(res);
      setStripeShowData(res?.data?.stripe_connection.account_detail.external_accounts.data[0])
      setIsLoading(false)
    }).catch(error => { setIsLoading(false); console.log(error); })
  }, [token])

  const handlePayment = async () => {
    const url = 'https://connect.stripe.com/express/oauth/v2/authorize?response_type=code&scope=read_write&redirect_uri=https%3A%2F%2Fstaging.orangemoonsss.com%2Fstripe%2Fconnect-stripe-redirect&client_id=ca_Kz1aOhcWevW0ykZu1nnhOHp07QrKyBB5';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Open the URL in the default browser
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open URL: " + url);
    }
  };
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
    // const sortedData = [...stripeTableData].sort((a, b) => {
    //   let aValue = '';
    //   let bValue = '';
    //   if (columnKey == 'group_name') {
    //     sortDataType = typeof stripeTableData[0]?.booking_day?.booking?.group_name
    //     aValue = a?.booking_day?.booking?.group_name;
    //     bValue = b?.booking_day?.booking?.group_name;
    //   } else if (columnKey == 'status') {
    //     sortDataType = typeof stripeTableData[0][columnKey]
    //     aValue = a?.status;
    //     bValue = b?.status;
    //   } else {
    //     sortDataType = typeof stripeTableData[0]['booking_day'][columnKey]
    //     aValue = a?.booking_day[columnKey];
    //     bValue = b?.booking_day[columnKey];
    //   }
    //   switch (sortDataType) {
    //     case 'number':
    //       return nextSortDirection === 'ascending' ? aValue - bValue : bValue - aValue;
    //     case 'string':
    //       return nextSortDirection === 'ascending' ? aValue?.localeCompare(bValue) : bValue?.localeCompare(aValue);
    //     case 'object': // Assuming the data type is Date
    //       return nextSortDirection === 'ascending' ? aValue?.getTime() - bValue?.getTime() : bValue?.getTime() - aValue?.getTime();
    //     default:
    //       return 0; // Return 0 for unknown data types or if sortKey is not found
    //   }
    // });
    // console.log(sortDirections, columnKey, sortDataType, sortedData)
    // setStripeTableData(sortedData);
    setStripeTableData(sortDataType);
  };
  return (
    <>
      {isLoading && (
        <LoadingContainer />
      )}
      {!isLoading && (
        <ScrollView style={styles.main}>
          <View style={styles.container}>
          <Text style={globalStyles.subtitle}> Stripe Connect </Text>
            <Divider style={globalStyles.divider} />
            {stripeShowData?.length !== 0 && stripeData && (
              <View style={styles.accountDetailsContainer}>
                <View style={styles.detailRow} >
                  <Text style={styles.keyText} >Connected Via </Text>
                  <Text style={styles.valueText}>{stripeShowData?.object} </Text>
                </View>
                <View style={styles.detailRow} >
                  <Text style={styles.keyText} >Connected Account </Text>
                  <Text style={styles.valueText}>{stripeShowData?.account} </Text>
                </View>
                <View style={styles.detailRow} >
                  <Text style={styles.keyText} >Brand </Text>
                  <Text style={styles.valueText}>{stripeShowData?.brand}  </Text>
                </View>
                <View style={styles.detailRow} >
                  <Text style={styles.keyText} >Card number  </Text>
                  <Text style={styles.valueText}>{stripeShowData?.last4}  </Text>
                </View>
                <View style={styles.detailRow} >
                  <Text style={styles.keyText} >Exp. Month  </Text>
                  <Text style={styles.valueText}>{stripeShowData?.exp_month}  </Text>
                </View>
                <View style={styles.detailRow} >
                  <Text style={styles.keyText} >Exp. Year  </Text>
                  <Text style={styles.valueText}>{stripeShowData?.exp_year}  </Text>
                </View>
                <View style={styles.detailRow} >
                  <Text style={styles.keyText} >Country </Text>
                  <Text style={styles.valueText}>{stripeShowData?.country}  </Text>
                </View>
                <View style={styles.detailRow} >
                  <Text style={styles.keyText} >Currency </Text>
                  <Text style={styles.valueText}>{stripeShowData?.currency}  </Text>
                </View>
                <View style={styles.detailRow} >
                  <Text style={styles.keyText} >Status </Text>
                  <Text style={styles.valueText}>{stripeShowData?.status}  </Text>
                </View>
                <Button
                  mode="contained"
                  onPress={handlePayment}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Update Account
                </Button>
              </View>
            )}
            {stripeShowData?.length === 0 && stripeData && (
              <Button
                mode="contained"
                onPress={handlePayment}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                + Connect Stripe
              </Button>
            )}
             <Divider style={globalStyles.divider} />
            <View style={styles.DataTable}>
              <ScrollView horizontal >
                <DataTable style={globalStyles.DataTable}>
                  <DataTable.Header style={globalStyles.header}>
                    <DataTable.Title sortDirection={sortDirections.group_name} onPress={() => handleSort('group_name')} style={globalStyles.headerCellDate}> Account ID </DataTable.Title>
                    <DataTable.Title sortDirection={sortDirections.date} onPress={() => handleSort('date')} style={globalStyles.headerCellDate}> Transfer ID </DataTable.Title>
                    <DataTable.Title sortDirection={sortDirections.start_time} onPress={() => handleSort('start_time')} style={globalStyles.headerCellCommon}> Amount </DataTable.Title>
                    <DataTable.Title sortDirection={sortDirections.end_time} onPress={() => handleSort('end_time')} style={globalStyles.headerCellCommon}> Created </DataTable.Title>
                  </DataTable.Header>
                  {isLoading && (<LoadingContainer />)}
                  {stripeTableData.slice(from, to).map((item) => (
                    <DataTable.Row key={item.id} >
                      <DataTable.Cell style={globalStyles.CellDate} >{item?.booking_day?.booking?.group_name}</DataTable.Cell>
                      <DataTable.Cell style={globalStyles.CellDate}> {formatDate(item?.booking_day?.date)} </DataTable.Cell>
                      <DataTable.Cell >{formatTime(item?.booking_day?.start_time)}</DataTable.Cell>
                      <DataTable.Cell >{formatTime(item?.booking_day?.end_time)}</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                  {!stripeTableData?.length && !isLoading && (<Text style={globalStyles.emptyData}> Data not found</Text>)}
                  <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(stripeTableData.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${stripeTableData.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                  />
                </DataTable>
                    </ScrollView>
            </View>

            {/* <Button
              mode="contained"
              onPress={() => navigation.navigate('HomeStack')}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              + Connect Stripe
            </Button> */}
          </View>
        </ScrollView>
      )}

    </>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    marginHorizontal: 20,
  },
  buttonContent: {
    height: 40,
  },
  accountDetailsContainer: {
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 15,
    padding : 1,
  },
  keyText: {
    flex: 1,
    fontWeight: '700',
    color: '#777',
    marginRight: 4, 
    fontSize: 12
},
valueText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12
},
  DataTable: {
    marginTop: 20
  }
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(mapStateToProps)(PaymentScreen);
