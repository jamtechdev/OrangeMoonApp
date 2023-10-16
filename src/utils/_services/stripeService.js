/* eslint-disable prettier/prettier */
import axios from "axios";
// import { Connection } from "../connection";
import axiosInstance from "./axiosService";
// const API_URL = Connection.staging;

const API_URL = 'https://staging.orangemoonsss.com/api/v1'
export const stripeService = {
    checkStripeConnection,
    storeStripeAccount,
    stripePayoutDetails
};

async function checkStripeConnection(token) {
    return await axiosInstance.get(
        `${API_URL}/check-stripe-connect`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}
async function stripePayoutDetails(token) {
    return await axiosInstance.get(
        `${API_URL}/stripe/payout`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}

async function storeStripeAccount(token, stripe_account_id) {
    return await axiosInstance.post(
        `${API_URL}/store-stripe-account/${stripe_account_id}`,
        {
            headers: { 'Authorization': 'Bearer ' + token },
        }
    );
}