/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { HelperText } from 'react-native-paper';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MultiSelect from 'react-native-multiple-select';
import { AppStyles } from '../utils/AppStyles';
const FormDropdown = ({
    control,
    updateValue,
    defaultValue,
    setDropdownName,
    dropdownName,
    name,
    label,
    Index = 1000,
    options,
    multi = false, // Multi-select flag
    searchable = false,
    error,
    helperText,
}) => {
    const [selectedItems, setSelectedItems] = useState(multi ? defaultValue : [defaultValue]); // Ensure selectedItems is an array

    useEffect(() => {
        updateValue(name, multi ? selectedItems : selectedItems[0]); // Pass selected item or the first item
    }, [selectedItems]);

    const styleIndex = {
        detailItem: {
            alignItems: 'start',
            marginBottom: 10,
            zIndex: 999999 + Index,
        },
    };

    return (
        <View style={styles.detailItem}>
            <Text style={styles.labelText}>{label} : </Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <View style={{ width: '100%' }}>

                        <MultiSelect
                            items={options}
                            uniqueKey="value"
                            fixedHeight={true}
                            onSelectedItemsChange={(selectedItems) => {
                                setSelectedItems(multi ? selectedItems : [selectedItems[0]]);
                            }}
                            selectedItems={selectedItems}
                            selectText="Choose your option..."
                            searchInputPlaceholderText="Search Items..."
                            onChangeInput={(text) => console.log(text)}
                            altFontFamily="ProximaNova-Light"
                            tagRemoveIconColor={AppStyles.color.tint}
                            tagBorderColor={AppStyles.color.tint}
                            tagTextColor="#000"
                            selectedItemTextColor={AppStyles.color.tint}
                            selectedItemIconColor={AppStyles.color.tint}
                            // tagContainerStyle={{ backgroundColor: '#fff' }}
                            itemTextColor="#000"
                            displayKey="label"
                            searchInputStyle={{ color: '#CCC' }}
                            submitButtonColor="#CCC"
                            submitButtonText="Submit"
                            hideSubmitButton={true}
                            styleDropdownMenu={{ width: '100%', alignSelf: 'stretch' }}
                            single={!multi}
                        />
                        {error && (
                            <HelperText type="error" visible={error}>
                                {helperText}
                            </HelperText>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    detailItem: {
        // alignItems: 'start',
        flex: 1,
        width: '100%',
        marginBottom: 10,
        // zIndex: 99999999,
    },
    labelText: {
        fontSize: 16,
        color: '#777',
        fontWeight: '700',
        marginRight: 10,
        textAlign: 'left',
        paddingBottom: 10,
    },
});

export default FormDropdown;
