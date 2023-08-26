/* eslint-disable prettier/prettier */
import React from 'react';
import { Controller } from 'react-hook-form';
import globalStyles from '../utils/_css/globalStyle';
import { View, StyleSheet } from 'react-native';
import { RadioButton, Text, Divider, HelperText } from 'react-native-paper';

const FormRadioButtons = ({ control, name, label, options, defaultValue, errors }) => (
    <View style={styles.detailItem}>
        <Text style={styles.labelText}>{label} : </Text>
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue} // Set the default value here
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View style={styles.radioButtonContainer}>
                    <View style={styles.radioButtonRow}>
                        {options.slice(0, 2).map((option) => (
                            <RadioButton.Item key={option.value} label={option.label} status={value === option.value ? 'checked' : 'unchecked'} value={option.value} onPress={() => onChange(option.value)} />
                        ))}
                    </View>
                    <View style={styles.radioButtonRow}>
                        {options.slice(2).map((option) => (
                            <RadioButton.Item key={option.value} label={option.label} status={value === option.value ? 'checked' : 'unchecked'} value={option.value} onPress={() => onChange(option.value)} />
                        ))}
                    </View>
                    {error && <HelperText type="error" visible={true}>{error.message}</HelperText>}
                </View>
            )}
        />
        <Divider style={globalStyles.divider} />
    </View>
);

const styles = StyleSheet.create({
    detailItem: {
        marginBottom: 10,
    },
    radioButtonContainer: {
        // flexDirection: 'row', // Display radio buttons in a row
        // alignItems: 'center', // Align items vertically
        // justifyContent: 'space-between', // Add space between radio buttons
    },
    radioButtonRow: {
        flexDirection: 'row', // Display radio buttons in a row
        alignItems: 'center', // Align items vertically
        justifyContent: 'space-between', // Add space between radio buttons
    },
    labelText: {
        // width: '40%',
        fontSize: 16,
        color: '#222',
        fontWeight: '600',
        paddingLeft: 10,
        textAlign: 'left',
        paddingBottom: 0,
    },
});

export default FormRadioButtons;
