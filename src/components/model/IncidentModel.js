/* eslint-disable prettier/prettier */
import React, {useLayoutEffect, useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Text, Pressable} from 'react-native';
import {
  List,
  Card,
  ActivityIndicator,
  Button,
  Divider,
  Snackbar,
  DataTable,
  Portal,
  Modal,
  Dialog,
} from 'react-native-paper';
import globalStyles from '../../utils/_css/globalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AppStyles} from '../../utils/AppStyles';
import { isWithin48Hours } from '../../utils/_helpers';
import FormTextInput from '../FormTextInput';
import FormRadioButtons from '../FormRadioButton';
const IncidentModel = ({
  visibleModel,
  hideModal,
  handleSubmit2,
  incidentSubmit,
  control2,
  errors2,
  setTimePickerVisibility,
  selectedTime
}) => {

  return (
    <Portal>
      <Modal
        visible={visibleModel}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.rowView}>
              <Text style={globalStyles.subtitle}>Incident</Text>
              <Icon
                color={AppStyles.color?.tint}
                style={[globalStyles.rightImageIcon, styles.closeIcon]}
                name="close"
                size={20}
                onPress={hideModal}
              />
            </View>
            <Divider style={globalStyles.divider} />
            <View style={styles.accountDetailsContainer}>
                <FormTextInput
                        control={control2}
                        errors={errors2}
                        name="location"
                        label="Location"
                      />
                      <FormRadioButtons
                        control={control2}
                        name="external"
                        label="Is External Involve"
                        options={[
                          {label: 'Yes', value: 'yes'},
                          {label: 'No', value: 'no'},
                        ]}
                        errors={errors2}
                      />
                      <FormRadioButtons
                        control={control2}
                        name="witness"
                        label="Is Witness Involve"
                        options={[
                          {label: 'Yes', value: 'yes'},
                          {label: 'No', value: 'no'},
                        ]}
                        errors={errors2}
                      />
                      <FormTextInput
                        control={control2}
                        errors={errors2}
                        name="incidentdescription"
                        label="Description"
                      />
                      <View>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            color: '#777',
                          }}>
                          Time:
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          minHeight: 60,
                        }}>
                        <View style={{padding: 12}}>
                          <Text
                            style={{
                              fontSize: 16,
                              color: '#777',
                              fontWeight: '600',
                              textAlign: 'left',
                              paddingBottom: 0,
                            }}>
                            {selectedTime}
                          </Text>
                        </View>
                        <Button
                          textColor={AppStyles.color.white}
                          buttonColor={AppStyles.color.tint}
                          mode="contained-tonal"
                          style={{...styles.buttonStyle, height: 40}}
                          onPress={() => setTimePickerVisibility(true)}
                          uppercase={false}>
                          Pick time
                        </Button>
                      </View>
                      <View style={{padding: 10}}>
                        <Divider style={globalStyles.divider} />
                      </View>
                      <FormTextInput
                        control={control2}
                        errors={errors2}
                        name="witness_description"
                        label="Witness Description"
                      />
                      <FormTextInput
                        control={control2}
                        errors={errors2}
                        name="students"
                        label="Students"
                      />
                      <FormTextInput
                        control={control2}
                        errors={errors2}
                        name="rooms"
                        label="Rooms"
                      />

            </View>
            {/* <Divider style={globalStyles.divider} /> */}
              <View style={globalStyles.buttonRow}>
                <Button
                 textColor={AppStyles.color.white}
                 mode="contained-tonal"
                  buttonColor={AppStyles.color.tint}
                onPress={handleSubmit2(incidentSubmit)}>
                  {' '}
                  Submit
                </Button>
                <Button
                 textColor={AppStyles.color.black}
                 mode="contained-tonal"
                  buttonColor={AppStyles.color.gray}
                  onPress={() => {
                  hideModal()
                  }}>
                  {' '}
                  Back{' '}
                </Button>
              </View>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};
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
    marginHorizontal: 10,
  },
  iconGap: {
    width: 20,
  },
  hederGap: {
    width: 20,
  },
  nextDiv: {
    marginVertical: 15,
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  todayButton: {
    color: AppStyles.color?.tint,
    fontWeight: '700',
  },
  monthText: {
    textAlign: 'center',
    color: AppStyles.color?.black,
    fontWeight: '700',
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateIcon: {
    marginHorizontal: 15,
  },
  customEventContainer: {
    borderRadius: 5,
    padding: 8,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventText: {
    color: AppStyles.color.white,
    fontSize: 8,
    fontWeight: '600',
  },
  input: {
    marginTop: 15,
  },
  buttonStyle: {
    paddingHorizontal: 15,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountDetailsContainer: {
    marginTop: 10,
  },
  modalView: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    // paddingVertical:5,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 3,
  },
  keyText: {
    flex: 1,
    fontWeight: '700',
    color: '#777',
    marginRight: 4, // Add some margin for separation
    fontSize: 12,
  },
  valueText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
  },
  closeIcon: {
    right: 0,
    top: 15,
  },
  tableAddress: {
    flex: 3,
    width: 300,
  },
  tableAction: {
    flex: 2,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    color: AppStyles.color.white,
    backgroundColor: AppStyles.color.tint,
    fontSize: 8,
  },
});

export default IncidentModel;
