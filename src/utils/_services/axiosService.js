/* eslint-disable prettier/prettier */
import axios from "axios";
import { Alert } from "react-native";
let alertShown = false;
function handleUnauthorizedError(error) {
    if (error.response && error.response.status === 401) {
        if (!alertShown) {
            alertShown = true;
            Alert.alert('Token Alert', 'Token expired, you need to logout and  login again ', [
              { text: 'Cancel', style: 'cancel' },
            ], { cancelable: true });
          }
    }
    return Promise.reject(error);
  }

  const axiosInstance = axios.create();
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => handleUnauthorizedError(error)
  );

  export default axiosInstance;