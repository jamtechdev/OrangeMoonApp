/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Avatar, Text, Divider, Card, Button, Portal, FAB, Dialog } from 'react-native-paper';
import { connect } from 'react-redux';
import globalStyles from '../utils/_css/globalStyle';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { AppStyles, AppIcon } from '../utils/AppStyles';
import { useForm, Controller } from "react-hook-form";
import { loginSuccess } from '../redux/actions/authActions';
import FormTextInput from '../components/FormTextInput';
import FormRadioButtons from '../components/FormRadioButton';
import FormDateInput from '../components/FormDateInput';
import FormDropdown from '../components/FormDropdown';
import ImagePicker from 'react-native-image-crop-picker';
import { monitorService } from '../utils/_services';
import { transformedStateData, transformedCityData, phoneRegExp, socialSecurity, numberArray, formatPhoneNumber, formatSocialSecurity } from '../utils/_helpers';
import { authService } from '../utils/_services/authService';
import Icon from 'react-native-vector-icons/FontAwesome';

function EditProfileScreen({ user, token, navigation, login }) {
    const { first_name, last_name, email, monitor, password, userEmail } = user;
    const [imageSrc, setImageSrc] = useState('https://staging.orangemoonsss.com/images/' + monitor?.photo);
    const [image, setImage] = useState('')
    const [loading, setLoading] = useState(false);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [visible, setVisible] = useState(false);
    const onToggleValue = () => setVisible(!visible);
    const [dropdownName, setDropdownName] = useState([{ 'state_id': '', 'city_id': '' }]);
    const [open, setOpen] = useState(false)
    const validationSchema = Yup.object().shape({
        first_name: Yup.string().required("First Name is required"),
        last_name: Yup.string().required("Last Name is required"),
        email: Yup.string().required("Email is required").email("Email is invalid"),
        payRate: Yup.string().required("Hourly Rate is required"),
        d_o_b: Yup.string().required("DOB is required"),
        gender: Yup.string().required("Gender is required"),
        shirt_size: Yup.string().required("Shirt Size is required"),
        social_security: Yup.string()
            .required("Social Security is required")
            .matches(socialSecurity, "Social Security is not valid")
            .min(9, "Phone number must be at least 9 digits"),
        address: Yup.string().required("Address is required"),
        phone: Yup.string()
            .required("Phone number is required")
            .matches(phoneRegExp, "Phone number is not valid")
            .min(10, "Phone number must be at least 10 digits"),
        emergency_contact_name: Yup.string().required("Emergency Contact Name is required"),
        emergency_contact_phone: Yup.string()
            .required("Emergency Contact Phone is required")
            .matches(phoneRegExp, "Emergency Contact Phone is not valid")
            .min(10, "Emergency Contact Phone must be at least 10 digits"),
        state_id: Yup.string().required("State is required"),
        city_id: Yup.string().required("City is required"),
        zip_code: Yup.string().required("Zipcode is required"),
        preferred_location: Yup.array().min(1, "Preferred Job Location is required"),
        medical_condition: Yup.string().required("Medical Conditions/Allergies is required"),
        password: Yup.string().required("Password is required")
        //   .min(8, "Password must be at least 8 characters"),
    });
    const formOptions = { resolver: yupResolver(validationSchema), mode: 'onChange' };
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm(formOptions);
    const stateFieldValue = watch('state_id');
    const phone_Value = watch('phone');
    const social_value = watch('social_security');
    const emergency_contact = watch('emergency_contact_phone');
    useEffect(() => {
        setValue('phone', formatPhoneNumber(phone_Value));
        setValue('social_security', formatSocialSecurity(social_value));
        setValue('emergency_contact_phone', formatPhoneNumber(emergency_contact));
    }, [emergency_contact, phone_Value, social_value])
    useEffect(() => {
        if (monitor && stateFieldValue) {
            getCityData(stateFieldValue);
        }
    }, [stateFieldValue])
    useEffect(() => {
        setDefaultValues();
        monitorService.getStateList(token).then(res => {
            setStateList(transformedStateData(res.data.states));
        }).catch(error => {
            console.log(error);
        });

    }, [])
    const getCityData = (id) => {
        monitorService.getCityList(token, id).then(res => {
            let data = transformedCityData(res.data.cities)
            setCityList(data);
            // setValue('city_id', '');
        }).catch(error => {
            console.log(error);
        });
    }
    const setDefaultValues = () => {
        setValue('first_name', first_name || '');
        setValue('last_name', last_name || '');
        setValue('email', email || '');
        setValue('payRate', monitor?.payRate?.toString() || '');
        setValue('d_o_b', monitor?.d_o_b || '');
        setValue('gender', monitor?.gender || '');
        setValue('shirt_size', monitor?.shirt_size || '');
        setValue('social_security', monitor?.social_security || '');
        setValue('address', monitor?.address || '');
        setValue('phone', monitor?.phone || '');
        setValue('emergency_contact_name', monitor?.emergency_contact_name || '');
        setValue('emergency_contact_phone', monitor?.emergency_contact_phone || '');
        setValue('zip_code', monitor?.zip_code || '');
        setValue('medical_condition', monitor?.medical_condition || '');
        setValue('password', password || '');
    };
    const memoizedProp = useMemo(() => cityList, [cityList]);
    const openCamera = async () => {
        try {
            const image = await ImagePicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
            });
            if (image) {
                setImageSrc(image.path);
                setImage(image);
            }
        } catch (error) {
            console.error('Error opening camera:', error);
        }
    };

    const openGallery = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
            });
            if (image) {
                setImageSrc(image.path);
                setImage(image);
            }
        } catch (error) {
            console.error('Error opening image gallery:', error);
        }
    };
    const onSubmit = (data) => {
        setLoading(true)
        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('email', data.email);
        formData.append('payRate', data.payRate);
        formData.append('d_o_b', data.d_o_b);
        formData.append('gender', data.gender);
        formData.append('shirt_size', data.shirt_size);
        formData.append('social_security', data.social_security);
        formData.append('address', data.address);
        formData.append("phone", data.phone);
        formData.append('emergency_contact_name', data.emergency_contact_name);
        formData.append('emergency_contact_phone', data.emergency_contact_phone);
        formData.append('state_id', data.state_id);
        formData.append('city_id', data.city_id);
        formData.append('zip_code', data.zip_code);
        formData.append('preferred_location', JSON.stringify(data.preferred_location));
        formData.append('medical_condition', data.medical_condition);
        formData.append('password', data.password);
        if (image) {
            formData.append('image', {
                uri: image?.path,
                name: image?.modificationDate + 'image.jpg',
                type: image?.mime,
            });
        }
        monitorService.editProfile(token, monitor.id, formData).then(res => {
            onToggleValue();
            authService.login({ email: userEmail, password: data.password })
                .then((res) => {
                    setLoading(false);
                    if (res && res.data && res.data.status === true) {
                        let response = res.data;
                        response['data']["password"] = data.password;
                        response['data']["userEmail"] = data.email;
                        const token = response?.token;
                        login(response?.data, token);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err, "error here ");
                });
        }).catch(error => {
            console.log(error);
        });
    };
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        >
            <ScrollView style={globalStyles.cardContainer} nestedScrollEnabled={true}>
                <Card style={globalStyles.card}>
                    <Card.Content >
                        <View style={styles.content}>
                            <View style={globalStyles.imageRow}>
                            {/* <Icon color={AppStyles.color?.tint} style={globalStyles.leftImageIcon} name='image' size={22} /> */}
                            <Avatar.Image size={150} source={{ uri: imageSrc }} style={styles.profileImage} />
                            {/* <Icon color={AppStyles.color?.tint} style={globalStyles.rightImageIcon} name='camera' size={22} /> */}
                            </View>
                        </View>
                        <Text style={styles.heading} > Edit Profile </Text>
                        <Divider style={globalStyles.divider} />
                        <View style={styles.detailsContainer}>
                            <FormTextInput control={control} errors={errors} name="first_name" label="First Name" />
                            <FormTextInput control={control} errors={errors} name="last_name" label="Last Name" />
                            <FormTextInput control={control} errors={errors} name="email" label="Email" />
                            <FormTextInput control={control} errors={errors} name="payRate" label="Hourly Rate" />
                            <FormDateInput control={control} name="d_o_b" label="DOB" setValue={setValue} errors={errors} defaultValue={monitor?.d_o_b} />
                            <FormRadioButtons
                                control={control}
                                name="gender"
                                label="Gender"
                                options={[
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'Female' },
                                    { label: 'Prefer not to say', value: 'not_to_say' },
                                ]}
                                errors={errors}
                            />
                            <FormTextInput control={control} errors={errors} name="shirt_size" label="Shirt Size" />
                            <FormTextInput control={control} errors={errors} name="social_security" label="Social Security" password={true} />
                            <FormTextInput control={control} errors={errors} name="address" label="Address" />
                            <FormTextInput control={control} errors={errors} name="phone" label="Phone" />
                            <FormTextInput control={control} errors={errors} name="emergency_contact_name" label="Emergency Contact Name" />
                            <FormTextInput control={control} errors={errors} name="emergency_contact_phone" label="Emergency Contact Phone" />
                            {stateList.length !== 0 && (
                                <FormDropdown
                                    control={control}
                                    name="state_id"
                                    label="State "
                                    options={stateList}
                                    setDropdownName={setDropdownName}
                                    dropdownName={dropdownName}
                                    searchable={true}
                                    updateValue={setValue}
                                    defaultValue={monitor?.state_id || ''}
                                    Index={75000}
                                    error={!!errors.state_id} // Check if the field has errors
                                    helperText="Select one or more options"
                                />
                            )}
                            {cityList.length !== 0 && (
                                <FormDropdown
                                    control={control}
                                    name="city_id"
                                    label="City "
                                    options={memoizedProp}
                                    Index={65000}
                                    setDropdownName={setDropdownName}
                                    dropdownName={dropdownName}
                                    searchable={true}
                                    updateValue={setValue}
                                    defaultValue={monitor?.city_id || ''}
                                    error={!!errors.city_id} // Check if the field has errors
                                    helperText="Select one or more options"
                                />
                            )}
                            <FormTextInput control={control} errors={errors} name="zip_code" label="Zipcode" />
                            {stateList.length !== 0 && (
                                <FormDropdown
                                    control={control}
                                    name="preferred_location"
                                    label="Preferred Job Location"
                                    options={stateList}
                                    updateValue={setValue}
                                    defaultValue={numberArray(monitor?.preferred_location) || []}
                                    error={!!errors.selectedOptions} // Check if the field has errors
                                    helperText="Select one or more options"
                                    multi={true}
                                />
                            )}
                            <FormTextInput control={control} errors={errors} name="medical_condition" label="Medical Conditions/Allergies" multiline={true} />
                            <FormTextInput control={control} errors={errors} name="password" label="Password" password={true} />

                        </View>
                        <View style={styles.buttonContainer}>
                            <Button style={globalStyles.inputStyle} textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" onPress={handleSubmit(onSubmit)} disabled={loading}>
                                Update details
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
                <Portal>
                    <FAB.Group
                        style={globalStyles.fabGroup}
                        open={open}
                        backdropColor={'#1f1f1f0a'}
                        icon={open ? 'cogs' : 'plus'}
                        actions={[
                            { icon: 'camera', onPress: () => openCamera() },
                            { icon: 'image', onPress: () => openGallery() },
                        ]}
                        onStateChange={() => setOpen(!open)}
                    />
                </Portal>
            </ScrollView>
            <Portal>
                <Dialog visible={visible} onDismiss={() => onToggleValue()}>
                    <Dialog.Title>Profile Update</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            Your profile information has been updated successfully.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => navigation.navigate('DrawerStack')}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    detailsContainer: {
        marginTop: 20,
    },
    content: {
        alignItems: 'center',
    },
    profileImage: {
        marginBottom: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 700
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
});

const mapStateToProps = (state) => ({
    user: state.auth.user,
    token: state.auth.token,
});
const mapDispatchToProps = (dispatch) => ({
    login: (response, token) => dispatch(loginSuccess(response, token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
