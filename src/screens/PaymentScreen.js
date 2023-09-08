/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { Divider, Button, Text, DataTable, Searchbar } from 'react-native-paper';
import { connect } from 'react-redux';
import globalStyles from '../utils/_css/globalStyle';
import { AppStyles } from '../utils/AppStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { formatDate, formatTime, createdDate } from '../utils/_helpers';
import { stripeService } from '../utils/_services/stripeService';
import LoadingContainer from '../components/LoadingContainer';
function PaymentScreen({ navigation, user, token }) {
  const [stripeData, setStripeData] = useState([])
  const [stripeTableData, setStripeTableData] = useState([])
  const [stripeTableDataBkp, setStripeTableDataBkp] = useState([])
  const [stripeShowData, setStripeShowData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortDirections, setSortDirections] = useState({
    transfer_id: 'none',
    transfer_account_id: 'none',
    amount: 'none',
    created_at: 'none',
  });
  const [searchQuery, setSearchQuery] = useState('');
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

    stripeService.stripePayoutDetails(token).then(res => {
      setStripeTableData(res?.data?.payment_records);
      setStripeTableDataBkp(res?.data?.payment_records);
      setIsLoading(false);
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
    const sortedData = [...stripeTableData].sort((a, b) => {
      let aValue = a?.[columnKey];
      let bValue = b?.[columnKey];

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
    setStripeTableData(sortedData);
  };
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredData = stripeTableData.filter((item) =>
      item?.amount?.toString()?.toLowerCase()?.includes(lowerCaseQuery) ||
      item?.transfer_account_id?.toLowerCase()?.includes(lowerCaseQuery) ||
      createdDate(item?.created_at)?.toLowerCase()?.includes(lowerCaseQuery) ||
      item?.transfer_id?.toLowerCase()?.includes(lowerCaseQuery)
    );
    if (filteredData.length == 0 || query == '') {
      setStripeTableData(stripeTableDataBkp)
    } else {
      setStripeTableData(filteredData)
    }
    setSearchQuery(query);
  };
  const renderStripeAccountStatus = () => {
    let status = stripeData?.status;
    if (status === 'connected') {
      return <Text style={{ color: 'green' }}>Connected</Text>;
    } else if (status === 'pending') {
      return <Text style={{ color: 'red' }}>Pending</Text>;
    } else if (status === 'kyc_needed') {
      return (
        <Text
          style={{ color: 'orange', cursor: 'pointer' }}
          onPress={handlePayment}
        >
          KYC Needed
        </Text>
      );
    } else {
      return '-';
    }
  }

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
            {stripeData?.status == 'bank_not_connected' ? (
              <Button
                mode="contained"
                onPress={handlePayment}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                + Connect Stripe
              </Button>
            ) : (
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
                  <Text style={styles.valueText}>{renderStripeAccountStatus()}  </Text>
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
            <Divider style={globalStyles.divider} />
            <View style={globalStyles.DataTable}>
              <Searchbar
                placeholder="Search"
                style={styles.Searchbar}
                onChangeText={handleSearch}
                value={searchQuery}
              />
              <ScrollView horizontal >
                <DataTable style={globalStyles.DataTable}>
                  <DataTable.Header style={globalStyles.header}>
                    <DataTable.Title sortDirection={sortDirections.transfer_id} onPress={() => handleSort('transfer_id')} style={styles.tableCellTwo}> Account ID </DataTable.Title>
                    <DataTable.Title sortDirection={sortDirections.transfer_account_id} onPress={() => handleSort('transfer_account_id')} style={globalStyles.tableCellGroup}> Transfer ID </DataTable.Title>
                    <DataTable.Title sortDirection={sortDirections.amount} onPress={() => handleSort('amount')} style={globalStyles.tableCell}> Amount </DataTable.Title>
                    <DataTable.Title sortDirection={sortDirections.created_at} onPress={() => handleSort('created_at')} style={styles.tableCellOne}> Created </DataTable.Title>
                  </DataTable.Header>
                  {isLoading && (<LoadingContainer />)}
                  {stripeTableData.slice(from, to).map((item) => (
                    <DataTable.Row key={item.id} >
                      <DataTable.Cell style={styles.tableCellTwo}> {item?.transfer_id}</DataTable.Cell>
                      <DataTable.Cell style={globalStyles.tableCellGroup}> {item?.transfer_account_id} </DataTable.Cell>
                      <DataTable.Cell style={globalStyles.tableCell}>{item?.amount}</DataTable.Cell>
                      <DataTable.Cell style={styles.tableCellOne}>{createdDate(item?.created_at)}</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                  {!stripeTableData?.length && !isLoading && (
                    <Text style={globalStyles.emptyData}>Data not found</Text>
                  )}
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
    padding: 1,
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
  tableCellOne: {
    flex: 1,
    width: 150,
  },
  tableCellTwo: {
    flex: 3,
    width: 250,
  },

});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(mapStateToProps)(PaymentScreen);
