/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import globalStyles from '../utils/_css/globalStyle';
import { View, StyleSheet, } from 'react-native';
import { Text, TextInput, HelperText } from 'react-native-paper';
import { AppStyles } from '../utils/AppStyles';
const FormTextInput = ({ control, name, label, password, multiline, errors, ...rest }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <View style={styles.detailItem}>
            <Text style={styles.labelText}>{label} : </Text>
            {password && (
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <>
                            <TextInput
                                style={styles.valueInput}
                                // label={label}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                {...rest}
                                secureTextEntry={!showPassword}
                                right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                            />
                            {error && <HelperText type="error" visible={true}>{error.message}</HelperText>}
                        </>
                    )}
                />
            )}
            {!password && (
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <>
                            <TextInput
                                style={styles.valueInput}
                                // label={label}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                multiline={multiline}
                                {...rest}
                            />
                            {error && <HelperText type="error" visible={true}>{error.message}</HelperText>}
                        </>
                    )}
                />
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    detailItem: {
        // flexDirection: 'row',
        alignItems: 'start',
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
        marginBottom: 10,
        width: AppStyles.textInputWidth.full,
    },
});

export default FormTextInput;
