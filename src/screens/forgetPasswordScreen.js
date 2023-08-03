/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TextInput, Text, Checkbox, Button, Snackbar, HelperText } from 'react-native-paper';
import { useForm, Controller } from "react-hook-form";
import { AppStyles, AppIcon } from '../utils/AppStyles';
import { connect } from 'react-redux';
import { authService } from '../utils/_services/authService';
import { loginSuccess } from '../redux/actions/authActions';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import FastImage from 'react-native-fast-image';
import globalStyles from '../utils/_css/globalStyle';
import { Link } from '@react-navigation/native';

function ForgetPasswordScreen({ navigation, user, login }) {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().required("Email is required").email("Email is invalid"),
        password: Yup.string()
            .required("Password is mandatory")
            .min(8, "Password must be at 8 char long"),
        // .matches(
        //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        // ),
        confirmPassword: Yup.string()
            .required("Confirm Password is mandatory")
            .oneOf([Yup.ref("password")], "Passwords does not match"),
    });
    const formOptions = { resolver: yupResolver(validationSchema), mode: 'onChange' };
    const { control, handleSubmit, formState: { errors } } = useForm(formOptions);

    const onSubmit = (data) => {
        setLoading(true);
        authService.login(data)
            .then((res) => {
                console.log(res);
                setLoading(false);
                if (res && res.data && res.data.status === true) {
                    const response = res.data;
                    const token = response?.token
                    // console.log('here my token', token)
                    login(response?.data, token)
                    navigation.navigate('DrawerStack');
                } else {
                    setVisible(true)
                    console.log(res.message);
                }
            })
            .catch((err) => {
                setVisible(true)
                setLoading(false);
                console.log(err, "error here ");
            });
    };


    return (
        <View style={globalStyles.container}>
            <FastImage
                style={globalStyles.logo}
                source={AppIcon.images.logo}
            />
            <Text style={[globalStyles.title, { marginTop: 70, marginBottom: 30 }]}>Sign In here </Text>
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={globalStyles.inputStyle}
                        mode='outlined'
                        label='Email'
                        activeOutlineColor={AppStyles.color.secondaryColor}
                        outlineColor={AppStyles.color.secondaryColor}
                        placeholder="Enter your Email "
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholderTextColor={AppStyles.color.grey}
                        underlineColorAndroid="transparent"
                    />
                )}
            />
            {errors?.email && (
                <HelperText type="error" visible={errors?.email}>
                    {errors?.email?.message}
                </HelperText>
            )}
            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        secureTextEntry={!showPassword}
                        placeholder="Enter your Password"
                        style={globalStyles.inputStyle}
                        mode='outlined'
                        label='Password'
                        activeOutlineColor={AppStyles.color.secondaryColor}
                        outlineColor={AppStyles.color.secondaryColor}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholderTextColor={AppStyles.color.grey}
                        underlineColorAndroid="transparent"
                        right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!confirmPassword)} />}
                    />
                )}
            />
            {errors?.password && (
                <HelperText type="error" visible={errors?.password}>
                    {errors?.password?.message}
                </HelperText>
            )}
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        secureTextEntry={!confirmPassword}
                        placeholder="Enter your Confirm Password"
                        style={globalStyles.inputStyle}
                        mode='outlined'
                        label='Confirm Password'
                        activeOutlineColor={AppStyles.color.secondaryColor}
                        outlineColor={AppStyles.color.secondaryColor}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholderTextColor={AppStyles.color.grey}
                        underlineColorAndroid="transparent"
                        right={<TextInput.Icon icon={confirmPassword ? "eye-off" : "eye"} onPress={() => setConfirmPassword(!ConfirmPassword)} />}
                    />
                )}
            />
            {errors?.confirmPassword && (
                <HelperText type="error" visible={errors?.confirmPassword}>
                    {errors?.confirmPassword?.message}
                </HelperText>
            )}
            <Button style={globalStyles.inputStyle} loading={loading} textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" onPress={handleSubmit(onSubmit)}>
                Update Password
            </Button>
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={3000}
            >
                Email & Password does not match with our record
            </Snackbar>
        </View>
    );
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
    login: (response, token) => dispatch(loginSuccess(response, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPasswordScreen);