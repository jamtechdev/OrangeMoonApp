/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Linking } from 'react-native';
import { Divider, Button, Text, DataTable, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import globalStyles from '../utils/_css/globalStyle';
import { AppStyles } from '../utils/AppStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { formatDate, formatTime, createdDate } from '../utils/_helpers';
import { stripeService } from '../utils/_services/stripeService';
import LoadingContainer from '../components/LoadingContainer';
import SearchBox from '../components/SearchBox';
import StipeCardList from '../components/cards/StripeCardList';
import StripeFilterSearch from '../components/searchFilter/StripeFilterSearch';
import NoDataFound from '../components/NoData';
function PaymentScreen({ navigation, user, token }) {
  const [stripeData, setStripeData] = useState([]);
  const [stripeTableData, setStripeTableData] = useState([]);
  const [stripeTableDataBkp, setStripeTableDataBkp] = useState([]);
  const [stripeShowData, setStripeShowData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 25, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, stripeTableData?.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  useEffect(() => {
    paymentApiData()
  }, [token]);
  const handleRefresh = () => {
    setRefreshing(true);
    paymentApiData()
  }
  const paymentApiData = () => {
    stripeService
      .checkStripeConnection(token)
      .then(res => {
        setStripeData(res?.data?.stripe_connection);
        console.log(res);
        setStripeShowData(
          res?.data?.stripe_connection.account_detail.external_accounts.data[0],
        );
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });

    stripeService
      .stripePayoutDetails(token)
      .then(res => {
        setStripeTableData(res?.data?.payment_records);
        setStripeTableDataBkp(res?.data?.payment_records);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      }).finally(() => {
        setRefreshing(false);
      });
  }

  const handlePayment = async () => {
    const url =
      'https://connect.stripe.com/express/oauth/v2/authorize?response_type=code&scope=read_write&redirect_uri=https%3A%2F%2Fapp.orangemoonsss.com%2Fstripe%2Fconnect-stripe-redirect&client_id=ca_Kz1aqXKrCnyt770OsvE7l7sqltb6F7QV';
    const supported = await Linking.openURL(url);
    if (supported) {
      // Open the URL in the default browser
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open URL: " + url);
    }
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
          onPress={handlePayment}>
          KYC Needed
        </Text>
      );
    } else {
      return '-';
    }
  };

  return (
    <>
      {isLoading && (
        <Portal>
          <LoadingContainer />
        </Portal>
      )}
      {!isLoading && (
        <ScrollView style={styles.main}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={AppStyles.color.tint}
            />
          }
          showsVerticalScrollIndicator={false} >
          <View style={styles.container}>
            <Text style={globalStyles.subtitle}> Stripe Connect </Text>
            <Divider style={globalStyles.divider} />
            {stripeData?.status == 'bank_not_connected' ? (
              <Button
                mode="contained"
                // onPress={handlePayment}
                onPress={() => handlePayment('connectStripe')}
                style={styles.button}
                contentStyle={styles.buttonContent}>
                + Connect Stripe
              </Button>
            ) : (
              <View style={styles.accountDetailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.keyText}>Connected Via </Text>
                  <Text style={styles.valueText}>
                    {stripeShowData?.object}{' '}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.keyText}>Connected Account </Text>
                  <Text style={styles.valueText}>
                    {stripeShowData?.account}{' '}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.keyText}>Brand </Text>
                  <Text style={styles.valueText}>{stripeShowData?.brand} </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.keyText}>Card number </Text>
                  <Text style={styles.valueText}>{stripeShowData?.last4} </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.keyText}>Exp. Month </Text>
                  <Text style={styles.valueText}>
                    {stripeShowData?.exp_month}{' '}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.keyText}>Exp. Year </Text>
                  <Text style={styles.valueText}>
                    {stripeShowData?.exp_year}{' '}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.keyText}>Country </Text>
                  <Text style={styles.valueText}>
                    {stripeShowData?.country}{' '}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.keyText}>Currency </Text>
                  <Text style={styles.valueText}>
                    {stripeShowData?.currency}{' '}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.keyText}>Status </Text>
                  <Text style={styles.valueText}>
                    {renderStripeAccountStatus()}{' '}
                  </Text>
                </View>
                <Button
                  mode="contained"
                  // onPress={handlePayment}
                  onPress={() => handlePayment('updateAccount')}
                  style={styles.button}
                  contentStyle={styles.buttonContent}>
                  Update Account
                </Button>
              </View>
            )}
            <Divider style={globalStyles.divider} />
            <View style={globalStyles.DataTable}>
              <StripeFilterSearch
                stripeTableData={stripeTableData}
                setStripeTableData={setStripeTableData}
                stripeTableDataBkp={stripeTableDataBkp}
              />

              {isLoading && <LoadingContainer />}
              {stripeTableData && stripeTableData.map((item, index) => (
                <StipeCardList item={item} key={index} />
              ))}
              {!stripeTableData?.length && !isLoading && (
                <NoDataFound />
              )}
              {/* <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(stripeTableData.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${stripeTableData.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                  /> */}
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
    backgroundColor: AppStyles.color.tint,
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
    fontSize: 12,
  },
  valueText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
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

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(mapStateToProps)(PaymentScreen);
