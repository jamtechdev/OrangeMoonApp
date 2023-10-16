/* eslint-disable prettier/prettier */
import axios from "axios";
export const authService = {
    login,
    logout,
    tokenCheck
    // forgotPass
};
const API_URL = 'https://staging.orangemoonsss.com/api/v1'
async function login(data) {
    return await axios.post(
        `${API_URL}/auth/login`,
        data,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
}
async function logout( token) {
    return await axios.get(
        `${API_URL}/auth/logout`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function tokenCheck(token) {
    return await axios.get(
        `${API_URL}/auth/check-token-validation`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}

// async function forgotPass(data, token) {
//     return await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/changePassword`,
//         { ...data },
//         { headers: { Authorization: "Bearer " + token } }
//     );
// }