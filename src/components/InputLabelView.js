/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, } from 'react-native-paper';
import { AppStyles } from '../utils/AppStyles';

const InputLabelView = React.memo(({ label, value, editable = false, password, multiline = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <View style={styles.detailItem}>
            <Text style={styles.labelText}>{label} : </Text>
            {password && (
                <TextInput
                    style={styles.valueInput}
                    value={value}
                    editable={editable}
                    secureTextEntry={!showPassword}
                    right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                />
            )}
            {!password && (
                <TextInput
                    style={styles.valueInput}
                    value={value}
                    editable={editable}
                    multiline={multiline}
                />
            )}
        </View>
    );
})

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
        marginBottom: 10,
        width: AppStyles.textInputWidth.full,
    },
});

export default InputLabelView