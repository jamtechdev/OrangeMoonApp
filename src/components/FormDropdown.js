/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import DropDownPicker from 'react-native-dropdown-picker';
import { HelperText } from 'react-native-paper';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, } from 'react-native-paper';
const FormDropdown = ({ control, updateValue, defaultValue, setDropdownName, dropdownName, name, label, Index = 1000, options, multi = false, searchable = false, error, helperText }) => {
    const [value, setValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(options);
    useEffect(() => {
        updateValue(name, value)
    }, [value])
    const  styleIndex ={ detailItem: {
        // flexDirection: 'row',
        alignItems: 'start',
        marginBottom: 10,
        zIndex : 999999 + Index,
    }}

    return (
        <View style={styleIndex.detailItem}>
            <Text style={styles.labelText}>{label} : </Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <React.Fragment>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={options}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            multiple={multi}
                            onSelectItem={(item) => {
                                if (name === 'state_id') {
                                    setDropdownName([
                                        {
                                            ...dropdownName[0], // Keep other properties unchanged
                                            'state_id': item.label
                                        }
                                    ]);
                                } else if (name === 'city_id') {
                                    setDropdownName([
                                        {
                                            ...dropdownName[0], // Keep other properties unchanged
                                            'city_id': item.label
                                        }
                                    ]);
                                }


                                console.log(item, name, dropdownName)

                            }}
                            min={0}
                            listMode="SCROLLVIEW"
                            mode="BADGE"
                            showBadgeDot={true}
                            extendableBadgeContainer={true}
                            max={100}
                            stickyHeader={true}
                            closeAfterSelecting={true}
                            // itemSeparator={true}
                            disableBorderRadius={true}
                            searchable={searchable}
                            style={styles.container}
                            placeholderStyle={styles.placeholderStyle}
                            itemStyle={styles.itemStyle}
                            zIndex={Index}
                            dropdownStyle={styles.dropdown}
                            dropDownDirection="BOTTOM"
                        />
                        {error && (
                            <HelperText type="error" visible={error}>
                                {helperText}
                            </HelperText>
                        )}
                    </React.Fragment>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    detailItem: {
        // flexDirection: 'row',
        alignItems: 'start',
        marginBottom: 10,
        zIndex : 99999999,
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
        marginBottom: 10
    },
    container: {
        marginBottom: 10,
    },
    placeholderStyle: {
        color: '#555', // Change the color to your preferred color
    },
    itemStyle: {
        justifyContent: 'flex-start',
    },
    dropdown: {
        position: 'absolute', // Make sure the dropdown is positioned absolutely
        top: 40, // Adjust the top position to avoid overlapping
        left: 0, // Adjust the left position if needed
    },
});

export default FormDropdown;
