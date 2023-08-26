/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, Text, Checkbox, Button, Snackbar } from 'react-native-paper';
import { useForm, Controller } from "react-hook-form";
import { AppStyles, AppIcon } from '../utils/AppStyles';
import { connect } from 'react-redux';
import { authService } from '../utils/_services/authService';
import { loginSuccess } from '../redux/actions/authActions';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import globalStyles from '../utils/_css/globalStyle';

function SignupScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const phoneRegExp =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    organization: Yup.string().required("Organization or School is required"),
    address: Yup.string().required("Address is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(phoneRegExp, "Phone number is not valid")
      .min(10),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is mandatory")
      .min(8, "Password must be at 8 char long"),
    confirmPassword: Yup.string()
      .required("Confirm Password is mandatory")
      .oneOf([Yup.ref("password")], "Passwords does not match"),
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    // ),
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
          // login({ payload: response?.data, token: response?.token })
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
    <ScrollView>
      <View style={globalStyles.container}>
        <Text style={[globalStyles.title, { marginTop: 10, marginBottom: 10 }]}>Create new Account </Text>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={globalStyles.inputStyle}
              mode='outlined'
              label='First Name'
              activeOutlineColor={AppStyles.color.secondaryColor}
              outlineColor={AppStyles.color.secondaryColor}
              placeholder="Enter your First Name "
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          )}
        />
        {errors.firstName && <Text style={globalStyles.errorMsg}>{errors.firstName.message}</Text>}
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={globalStyles.inputStyle}
              mode='outlined'
              label='Last Name'
              activeOutlineColor={AppStyles.color.secondaryColor}
              outlineColor={AppStyles.color.secondaryColor}
              placeholder="Enter your Last Name "
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          )}
        />
        {errors.lastName && <Text style={globalStyles.errorMsg}>{errors.lastName.message}</Text>}
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
        {errors.email && <Text style={globalStyles.errorMsg}>{errors.email.message}</Text>}
        <Controller
          control={control}
          name="organization"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={globalStyles.inputStyle}
              mode='outlined'
              label='Organization or School'
              activeOutlineColor={AppStyles.color.secondaryColor}
              outlineColor={AppStyles.color.secondaryColor}
              placeholder="Enter your Organization or School Name "
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          )}
        />
        {errors.organization && <Text style={globalStyles.errorMsg}>{errors.organization.message}</Text>}
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={globalStyles.inputStyle}
              mode='outlined'
              label='Address'
              activeOutlineColor={AppStyles.color.secondaryColor}
              outlineColor={AppStyles.color.secondaryColor}
              placeholder="Enter your Address "
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          )}
        />
        {errors.address && <Text style={globalStyles.errorMsg}>{errors.address.message}</Text>}
        <Controller
          control={control}
          name="Phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={globalStyles.inputStyle}
              mode='outlined'
              label='Phone'
              activeOutlineColor={AppStyles.color.secondaryColor}
              outlineColor={AppStyles.color.secondaryColor}
              placeholder="Enter your Phone number "
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          )}
        />
        {errors.phone && <Text style={globalStyles.errorMsg}>{errors.phone.message}</Text>}
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
              right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
            />
          )}
        />
        {errors.password && <Text style={globalStyles.errorMsg}>{errors.password.message}</Text>}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              secureTextEntry={!showPassword}
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
              right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
            />
          )}
        />
        {errors.confirmPassword && <Text style={globalStyles.errorMsg}>{errors.confirmPassword.message}</Text>}

        <Button style={globalStyles.inputStyle} loading={loading} textColor={AppStyles.color.white} buttonColor={AppStyles.color.tint} mode="contained-tonal" onPress={handleSubmit(onSubmit)}>
          Sign-Up
        </Button>
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={3000}
        >
          Email & Password does not match with our record
        </Snackbar>
      </View>
    </ScrollView>
  );
}
const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  // login: (response) => dispatch(loginSuccess(response)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
