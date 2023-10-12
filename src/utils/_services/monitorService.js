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
    bookingChangeStatus,
    getStateList,
    getCityList,
    editProfile,
    BookingReportActionCheck,
    getAllDetailsReport,
    getAllSchedulingEvent,
    getSchedulingAssignableBooking,
    setMonitorAvailablity,
    setSelfBooking,
    bookingdayActivity,
    prechecksResponse,
    precheckquestion,
    MonitorSubmitReport,
    IncidentActivity,
    markArrived
};

async function dashboard(token) {
    return await axios.get(
        `${API_URL}/monitor/dashboard`,
        {
            headers: { "Content-Type": "multipart/form-data", 'Authorization': 'Bearer ' + token },
        }
    );
}

async function bookingRequest(token, status) {
    let url = 'monitor-booking-requests'
    if (status !== 'All') {
        url = 'monitor-booking-requests?status=' + status
    }
    console.log(token, status)
    return await axios.post(
        `${API_URL}/${url}`,
        {},
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function bookingDetails(token, id) {
    return await axios.get(
        `${API_URL}/monitor-booking-requests/show/${id}`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function archivesBooking(token) {
    return await axios.get(
        `${API_URL}/monitor-archives-booking`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function completedReport(token) {
    return await axios.get(
        `${API_URL}/monitor/completed-reports`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function reportDetails(token, id) {
    return await axios.get(
        `${API_URL}/monitor/report/${id}`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function bookingChangeStatus(token, id, status) {
    return await axios.get(
        `${API_URL}/monitor-booking-requests/change-status/${id}/${status}`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function getStateList(token) {
    return await axios.get(
        `${API_URL}/get-state`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function getCityList(token, stateId) {
    return await axios.post(`${API_URL}/get-city/?state_id=${stateId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

async function editProfile(token, id, data) {
    return await axios.post(
        `${API_URL}/monitor/update-profile/${id}`,
        data,
        {
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/form-data' },
        }
    );
}

async function BookingReportActionCheck(token, data) {
    return await axios.post(
        `${API_URL}/monitor-booking-day-report`,
        data,
        {
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/form-data' },
        }
    );
}

//https://staging.orangemoonsss.com/api/v1/monitor-booking-day-report/78/continue/00:00/04:00

async function getAllDetailsReport(token, data) {
    return await axios.get(
        `${API_URL}/monitor-booking-day-report/${data?.id}/continue/${data?.start_Time}/${data?.end_Time}`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}

async function getAllSchedulingEvent(token) {
    return await axios.get(
        `${API_URL}/monitor-scheduling`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}

async function getSchedulingAssignableBooking(token) {
    return await axios.get(
        `${API_URL}/monitor/assignable-bookings`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function setMonitorAvailablity(token, data) {
    return await axios.post(
        `${API_URL}/set-monitor-availability`,
        data,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}

async function setSelfBooking(token, data) {
    return await axios.post(
        `${API_URL}/self-booking/assign-to-monitor`,
        data,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function bookingdayActivity(token, data) {
    return await axios.post(
        `${API_URL}/monitor-booking-day-report/activity`,
        data,
        {
            headers: { 'Authorization': 'Bearer ' + token }
        }
    );
}
async function prechecksResponse(token , data) {
    console.log("token, data", token , data)
    return await axios.post(
        `${API_URL}/monitor-booking-day-report/prechecks`,
        data,
        {
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/form-data' },
        }
    )
}
async function precheckquestion(token) {
    return await axios.get(
        `${API_URL}/monitor/precheck-questions`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function MonitorSubmitReport(token ,data) {
    console.log('token, data',token,data)
    return await axios.post(
        `${API_URL}/monitor/submit-report/${data.Monitor_Booking_Day_Report_Id}`,
        data.requestbody,
        {
            headers: { 'Authorization': 'Bearer ' + token,  'Content-Type': 'multipart/form-data' },
        }
    );
}
async function IncidentActivity(token, data) {
    return await axios.post(
        `${API_URL}/monitor-booking-day-report/incident`,
        data,
        {
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/form-data' },
        }
    );
}

async function markArrived(token, data) {
    return await axios.post(
        `${API_URL}/mark-arrival-by-monitor`,
        data,
        {
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/form-data' },
        }
    );
}