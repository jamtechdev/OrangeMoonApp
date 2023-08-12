/* eslint-disable prettier/prettier */
import axios from "axios";
// import { Connection } from "../connection";

// const API_URL = Connection.staging;
const API_URL = 'https://staging.orangemoonsss.com/api/v1'

export const chatService = {
    getConversation,
    postConversation,
    checkStatus,
    updateStatus,
    getUnreadMassageCount,
    updateUnreadMassage,
    getLatestChat,
    sendNotification
};
async function getConversation(token, sender_id, receiver_id, page) {
    return await axios.get(
        `${API_URL}/get-conversation?sender_id=${sender_id}&receiver_id=${receiver_id}&page=${page}`,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}

async function postConversation(token, data) {
    return await axios.post(
        `${API_URL}/post-conversation`,
        data,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}


async function checkStatus(token, user_id) {
    return await axios.post(
        `${API_URL}/check-activity-and-send-sms?user_id=${user_id}`,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}

async function updateStatus(token,status, user_id) {
    return await axios.post(
        `${API_URL}/store-online-status?status=${status}&user_id=${user_id}`,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}

async function getUnreadMassageCount(token, monitorId) {
    return await axios.get(
        `${API_URL}/get-monitor-unread-conversation?monitorId=${monitorId}'`,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}

async function updateUnreadMassage(token, receiver_id, sender_id) {
    return await axios.post(
        `${API_URL}/update-monitor-unread-conversation?receiver_id=${receiver_id}&sender_id=${sender_id}`,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}

async function getLatestChat(token) {
    return await axios.get(
        `${API_URL}/get/latest/chats`,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}

async function sendNotification(token, user_id) {
    return await axios.post(
        `${API_URL}/send-notification?user_id=${user_id}`,
        {
            headers: { 'Authorization' : 'Bearer ' + token },
        }
    );
}
