/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState , useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { List, Card, Avatar, Title, Paragraph, DataTable } from 'react-native-paper';
import { connect } from 'react-redux';
import { monitorService } from '../utils/_services';
function ArchiveBooking({ navigation, user , token, route}) {
  const [ArchiveData, setArchiveData] = useState([])
//   const [page, setPage] = React.useState(0);
//   const [numberOfItemsPerPageList] = React.useState([10, 25, 50, 100 ]);
//   const [itemsPerPage, onItemsPerPageChange] = React.useState(
//     numberOfItemsPerPageList[0]
//   );
//    const from = page * itemsPerPage;
//    const to = Math.min((page + 1) * itemsPerPage, ArchiveData?.length);

//    React.useEffect(() => {
//      setPage(0);
//    }, [itemsPerPage]);

  useEffect(()=>{
    monitorService.archivesBooking(token).then(res=>{
      console.log(res,"here my console res");
      setArchiveData(res?.data?.data)
    }).catch(error=>console.log(error))
  },[])


  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <List.Section>
          { ArchiveData && ArchiveData?.map((booking) => (
            <Card key={booking.id} style={styles.card} >
              <Card.Title title={`Request Id :  ${booking.booking_id}`} />
              <Card.Content>
                <Paragraph>Group Name : {booking.group_name} </Paragraph>
                <Paragraph>Start Date : {booking.start_date} </Paragraph>
                <Paragraph>End Date : {booking.end_date} </Paragraph>
                <Paragraph>Status : {booking.status} </Paragraph>
              </Card.Content>
            </Card>
          ))}
          {!ArchiveData?.length && (<Text> Data not found</Text>) }
        </List.Section>
      </View>
      {/* <DataTable>
      <DataTable.Header>
      <DataTable.Title>Request ID</DataTable.Title>
        <DataTable.Title>Group Name</DataTable.Title>
        <DataTable.Title numeric>Start Date</DataTable.Title>
        <DataTable.Title numeric>End Date</DataTable.Title>
        <DataTable.Title numeric>Status</DataTable.Title>
      </DataTable.Header>

      {ArchiveData.slice(from, to).map((item) => (
        <DataTable.Row key={item.id}>
            <DataTable.Cell>{item.id}</DataTable.Cell>
            <DataTable.Cell>{item.group_name}</DataTable.Cell>
            <DataTable.Cell >{item.dates}</DataTable.Cell>
            <DataTable.Cell >{item.status}</DataTable.Cell>
            <DataTable.Cell numeric>Action </DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(ArchiveData.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${ArchiveData.length}`}
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
    backgroundColor: '#fff',
    padding: 10,
  },
  card: {
    marginBottom: 16,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token : state.auth.token,
});

export default connect(mapStateToProps)(ArchiveBooking);