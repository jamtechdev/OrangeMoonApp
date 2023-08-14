/* eslint-disable prettier/prettier */
import axios from "axios";
// import { Connection } from "../connection";

// const API_URL = Connection.staging;

const API_URL = 'https://staging.orangemoonsss.com/api/v1'
export const monitorService = {
    dashboard,
    bookingRequest,
    bookingDetails,
    archivesBooking,
    completedReport,
    reportDetails,
};

async function dashboard(token) {
    return await axios.get(
        `${API_URL}/monitor/dashboard`,
        {
            headers: { "Content-Type": "multipart/form-data", 'Authorization' : 'Bearer ' + token },
        }
    );
}

async function bookingRequest(token, status) {
    let url = 'monitor-booking-requests'
    if(status){
        url = 'monitor-booking-requests?status='+ status
    }
    console.log(token, status)
    return await axios.post(
        `${API_URL}/${url}`,
        {},
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}
async function bookingDetails(token, id) {
    return await axios.get(
        `${API_URL}/monitor-booking-requests/show/${id}`,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}
async function archivesBooking(token) {
    return await axios.get(
        `${API_URL}/monitor-archives-booking`,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}
async function completedReport(token) {
    return await axios.get(
        `${API_URL}/monitor/completed-reports`,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}
async function reportDetails(token, id) {
    return await axios.get(
        `${API_URL}/monitor/report/${id}`,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}