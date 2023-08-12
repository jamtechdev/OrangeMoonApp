/* eslint-disable prettier/prettier */
import React, { useLayoutEffect , useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native'; // Import View
import { connect } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';
import { Surface, Text } from 'react-native-paper';
import { monitorService } from '../utils/_services';
import { DataTable } from 'react-native-paper';
function HomeScreen({ navigation, user, token }) {
  const { first_name, last_name, email, online_status, status, user_type } = user;
const [dashboardData, setDashboardData] = useState()
  useEffect(()=>{
    monitorService.dashboard(token).then(res=>{
      console.log(res,"here my console res");
      setDashboardData(res?.monitorBookingDayRequest)
    }).catch(error=>console.log(error))
  })
  const [page, setPage] = React.useState(1);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [items] = React.useState([
   {
     key: 1,
     name: 'Cupcake',
     calories: 356,
     fat: 16,
   },
   {
     key: 2,
     name: 'Eclair',
     calories: 262,
     fat: 16,
   },
   {
     key: 3,
     name: 'Frozen yogurt',
     calories: 159,
     fat: 6,
   },
   {
     key: 4,
     name: 'Gingerbread',
     calories: 305,
     fat: 3.7,
   },
  ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hii, {first_name} {last_name}</Text>
      <View style={styles.columnContainer}>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="titleMedium">User Details </Text>
          <Text>{email}</Text>
          <Text>User Type : {user_type }</Text>
        </Surface>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="titleMedium">User Status</Text>
          <Text>Status :  {status}</Text>
          <Text>Online Status :  {online_status}</Text>
        </Surface>
      </View>
      <View style={styles.columnContainer}>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="displaySmall">5</Text>
          <Text>Booking Requests </Text>
        </Surface>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="displaySmall">18</Text>
          <Text>Archive Booking</Text>
        </Surface>
      </View>
      <View style={styles.columnContainer}>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="displaySmall">15</Text>
          <Text>Scheduling</Text>
        </Surface>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="displaySmall">8</Text>
          <Text>Completed Reports</Text>
        </Surface>
      </View>

      {/* <DataTable>
      <DataTable.Header>
        <DataTable.Title>Dessert</DataTable.Title>
        <DataTable.Title numeric>Calories</DataTable.Title>
        <DataTable.Title numeric>Fat</DataTable.Title>
      </DataTable.Header>

      {items.slice(from, to).map((item) => (
        <DataTable.Row key={item.key}>
          <DataTable.Cell>{item.name}</DataTable.Cell>
          <DataTable.Cell numeric>{item.calories}</DataTable.Cell>
          <DataTable.Cell numeric>{item.fat}</DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(items.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${items.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
    </DataTable> */}

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
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token : state.auth.token,
});

export default connect(mapStateToProps)(HomeScreen);
