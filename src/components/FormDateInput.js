/* eslint-disable prettier/prettier */
import React from 'react';
import { Controller } from 'react-hook-form';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Divider, HelperText, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateToString } from '../utils/_helpers/format.helper';
const FormDateInput = ({ control, setValue, name, label, defaultValue, errors }) => {
    const [showPicker, setShowPicker] = React.useState(false);
    const defaultDate = defaultValue || control.defaultValuesRef.current[name] || new Date();
    const [selectedDate, setSelectedDate] = React.useState(new Date(defaultDate));

    const onDateChange = (event, selected) => {
        setShowPicker(false);
        if (selected) {
            setSelectedDate(selected);
            setValue(name, formatDateToString(selected));
        }
    };
    const toggleDatePicker=()=>{
        setShowPicker(!showPicker)
    }

    return (
        <View style={styles.detailItem}>
            <Text style={styles.labelText}>{label} : </Text>
            <Pressable onPress={() => toggleDatePicker()}>
                <TextInput
                    value={selectedDate.toDateString()}
                    editable={false}
                    onPressIn={() => toggleDatePicker()}
                    style={styles.valueInput} // Add custom styling to the input
                />
            </Pressable>
            <Controller
                control={control}
                name={name}
                defaultValue={formatDateToString(selectedDate)}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <View>
                        {showPicker && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
                        {error && <HelperText type="error" visible={true}>{error.message}</HelperText>}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    detailItem: {
        marginBottom: 10,
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


export default FormDateInput;
