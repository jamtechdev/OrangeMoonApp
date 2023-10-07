/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import {
  List,
  Card,
  ActivityIndicator,
  Button,
  Divider,
  Snackbar,
  TextInput,
  Portal,
  Modal,
  Dialog,
} from 'react-native-paper';
import globalStyles from '../../utils/_css/globalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppStyles } from '../../utils/AppStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateToString } from '../../utils/_helpers';
import { useForm, Controller } from "react-hook-form";
import FormDateInput from '../FormDateInput';

const SchedulingDateDialog = ({
  visibleDialog,
  hideDialog,
  isButtonLoading,
  updateAvailability,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setIsButtonLoading,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerEnd, setShowPickerEnd] = useState(false);
  const defaultDate = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date(startDate));
  const [selecteEndDate, setSelectedEndDate] = useState(new Date(endDate));
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm()

  // const onDateChange = (event, selected) => {
  //   setShowPicker(false);
  //   if (selected) {
  //     setSelectedDate(selected);
  //     let date = formatDateToString(selected)
  //     setStartDate(changeFormat(selected));
  //   }
  // };
  // const toggleDatePicker = () => {
  //   setShowPicker(!showPicker);
  // };
  // const toggleDatePickerEnd = () => {
  //   setShowPickerEnd(!showPickerEnd);
  // };
  // const onEndDateChange = (event, selected) => {
  //   setShowPickerEnd(false);
  //   if (selected) {
  //       setSelectedEndDate(selected);
  //       let date = formatDateToString(selected)
  //       setEndDate(changeFormat(date));
  //   }
  // };
  const changeFormat = (data) => {
    let parts = data.split("-");
    let day = parts[0];
    let month = parts[1];
    let year = parts[2];
    return year + "-" + month + "-" + day;
  }
  const onSubmit = (data, status) => {
    setIsButtonLoading(true)
    let start = changeFormat(data.start_Date);
    let end = changeFormat(data.end_Date)
    setStartDate(start);
    setEndDate(end);
    setTimeout(() => {
      updateAvailability(start, end, status)
    }, 200);
  }


  return (
    <Portal>
      <Dialog visible={visibleDialog} onDismiss={hideDialog}>
        <View style={styles.rowView}>
          <Dialog.Title style={globalStyles.subtitle}>Scheduling</Dialog.Title>
          <Icon
            color={AppStyles.color?.tint}
            style={globalStyles.rightImageIcon}
            name="close"
            size={20}
            onPress={hideDialog}
          />
        </View>
        <Divider style={globalStyles.divider} />
        <Dialog.Content>
          <View style={styles.input}>
            <FormDateInput control={control} name="start_Date" label="Start Date" defaultValue={startDate} setValue={setValue} errors={errors} />
            <FormDateInput control={control} name="end_Date" label="End Date" defaultValue={endDate} setValue={setValue} errors={errors} />
          </View>
          <ActivityIndicator
            animating={isButtonLoading}
            color={AppStyles.color.tint}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleSubmit((data) => onSubmit(data, 'NOT AVAILABLE'))}>
            NOT AVAILABLE{' '}
          </Button>
          <Button
            textColor={AppStyles.color.white}
            buttonColor={AppStyles.color.tint}
            mode="contained-tonal"
            style={styles.buttonStyle}
            onPress={handleSubmit((data) => onSubmit(data, 'AVAILABLE'))}>
            AVAILABLE
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    marginTop: 15,
  },
  view: {
    paddingVertical: 15,
    paddingLeft: 10,
    paddingTop: 35,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    // paddingHorizontal: 20,
  },
  detailItem: {
    marginBottom: 15,
  },
  labelText: {
    // width: '40%',
    fontSize: 16,
    color: '#777',
    fontWeight: '700',
    marginRight: 10,
    textAlign: 'left',
    paddingBottom: 10,
  },
  valueInput: {
    flex: 1,
    fontSize: 15,
    marginBottom: 10
  },
});

export default SchedulingDateDialog;
