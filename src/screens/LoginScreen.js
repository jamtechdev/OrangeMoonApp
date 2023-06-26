/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from "react-hook-form";
import { AppStyles } from '../utils/AppStyles';
import { connect } from 'react-redux';
import { authService } from '../utils/_services/authService';
import { useDispatch } from 'react-redux';
import {loginSuccess } from '../redux/actions/authActions';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";

function LoginScreen({ navigation, user, login  }) {
  const dispatch = useDispatch();
  const [loading, setLoading] =useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is mandatory")
      .min(8, "Password must be at 8 char long")
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
          login({payload:response?.data,token: response?.token})
          navigation.navigate('DrawerStack');
        }else{
          alert(res.message)
          console.log(res.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };


  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.leftTitle]}>Sign In</Text>
      <View style={styles.InputContainer}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
             <TextInput
              style={styles.body}
              placeholder="E-mail or phone number"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
        />
          )}
        />
      </View>
      {errors.email && <Text style={styles.errorMsg}>{errors.email.message}</Text>}
      <View style={styles.InputContainer}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.body}
              secureTextEntry={!showPassword}
              placeholder="Password"
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            
          )}
     
        />
        {/* <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.toggleButtonText}>
            {showPassword ? 'Hide' : 'Show'} Password
          </Text>
        </TouchableOpacity> */}
      </View>
      {errors.password && <Text style={styles.errorMsg}>{errors.password.message}</Text>}
      <TouchableOpacity
        style={[styles.facebookContainer, { marginTop: 50 }]}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.facebookText}>Sign Up</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 30 }}
          size="large"
          animating={loading}
          color={AppStyles.color.tint}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  or: {
    color: 'black',
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20,
  },
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
  loginContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  placeholder: {
    color: 'red',
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  facebookContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
  googleContainer: {
    width: 192,
    height: 48,
    marginTop: 30,
  },
  googleText: {
    color: AppStyles.color.white,
  },
  errorMsg:{
    color: AppStyles.color.error,
  }
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  login: (response) => dispatch(loginSuccess(response)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);