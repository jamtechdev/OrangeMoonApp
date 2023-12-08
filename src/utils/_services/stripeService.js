/* eslint-disable prettier/prettier */
import axios from "axios";
import { API_URL } from "../Connection";
import axiosInstance from "./axiosService";



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