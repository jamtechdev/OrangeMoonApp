/* eslint-disable prettier/prettier */
import React from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AppStyles } from '../utils/AppStyles';
import { useDispatch } from 'react-redux';
import { login } from '../reducers';
import { useForm, Controller } from "react-hook-form";

function SignupScreen({ navigation }) {
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);

    // axios.post('https://63fc84bb859df29986be3dac.mockapi.io/user', data)
    //   .then(res => {
    //     console.log(res);
    //     if (res.status === 201 && res.data.role === 'client') {
    navigation.navigate('HomeStack');
      //   }
      // })
      // .catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.leftTitle]}>Create new account</Text>
      <View style={styles.InputContainer}>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.body}
              placeholder="Full Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="name"
        />
      </View>
      {errors.name && <Text>This field is required.</Text>}

      <View style={styles.InputContainer}>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.body}
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="email"
        />
      </View>
      {errors.email && <Text>This field is required.</Text>}

      <View style={styles.InputContainer}>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.body}
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
          name="password"
        />
      </View>
      {errors.password && <Text>This field is required.</Text>}

      <View style={styles.InputContainer}>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.body}
              placeholder="Role (admin or client)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="role"
        />
      </View>
      {errors.role && <Text>This field is required.</Text>}

      <TouchableOpacity
        style={[styles.facebookContainer, { marginTop: 50 }]}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.facebookText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
});

export default SignupScreen;
