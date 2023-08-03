/* eslint-disable prettier/prettier */
import axios from "axios";
export const dashboardService = {
    dashboard,
    logout,
    // forgotPass
};
const API_URL = 'https://staging.orangemoonsss.com/api/v1'
async function dashboard(token) {
    return await axios.get(
        `${API_URL}/monitor/dashboard`,
        {
            headers: { "Content-Type": "multipart/form-data", 'Authorization' : 'Bearer ' + token },
        }
    );
}


async function logout(data, token) {
    return await axios.post(
        `${API_URL}/auth/logout`,
        { ...data },
        { headers: { Authorization: "Bearer " + token } }
    );
}
