/* eslint-disable prettier/prettier */
import React, { useLayoutEffect , useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native'; // Import View
import { connect } from 'react-redux';
import { AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';
import { monitorService } from '../utils/_services';
import { List,Text, Card, Avatar, Title,Surface, Paragraph, DataTable } from 'react-native-paper';
import Chat from './Chat';
function HomeScreen({ navigation, user, token }) {
  const { first_name, last_name, email, online_status, status, user_type } = user;
const [dashboardData, setDashboardData] = useState([])
  useEffect(()=>{
    monitorService.dashboard(token).then(res=>{
      // console.log(res,"here my console res");
      setDashboardData(res?.data?.data)
    }).catch(error=>console.log(error))
  })

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hii, {first_name} {last_name}</Text>
      <Text style={styles.subtitle}>Today's Booking</Text>
      <View style={styles.container}>
        <List.Section>
          { dashboardData && dashboardData?.map((booking) => (
            <Card key={booking.id} style={styles.card}>
              <Card.Title title={`Group Name  :  ${booking.group_name}`} />
              <Card.Content>
                <Paragraph>Status : {booking.dates} </Paragraph>
                <Paragraph>Start Time : {booking.start_time} </Paragraph>
                <Paragraph>End Time : {booking.end_time} </Paragraph>
                <Paragraph>Status : {booking.status} </Paragraph>
              </Card.Content>
            </Card>
          ))}
          {!dashboardData?.length && (<Text> Data not found</Text>) }
        </List.Section>
      </View>
      {/* <Pressable onPress={()=>  navigation.navigate('CompleteReportStack')}>
                    <Text>hiii click here </Text>
                    </Pressable> */}
      {/* <View style={styles.columnContainer}>
        <Surface style={styles.surface} elevation={5} >
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
      </View> */}
      {/* <View style={styles.columnContainer}>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="displaySmall">15</Text>
          <Text>Scheduling</Text>
        </Surface>
        <Surface style={styles.surface} elevation={5}>
          <Text variant="displaySmall">8</Text>
          <Text>Completed Reports</Text>
        </Surface>
      </View> */}

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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppStyles.color.title,
    marginBottom: 20,
    marginTop:5
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
