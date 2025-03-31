import APIParser from "./apiParser"
import http from "./axios"
import axios from 'axios';

export const validateToken = async (id) => {
    return await APIParser(http.get(`/payIn/validate-payIn-url/${id}`));

}

export const assignBankToPayInUrl = async (id, data) => {
    return await APIParser(http.post(`/payIn/assign-bank/${id}`, data));

}

export const checkPaymentStatus = async (id) => {
    return await APIParser(http.get(`/payIn/check-payment-status/${id}`));
}

// to submit img
export const imageSubmit = async (id, data) => {
    const res = await APIParser(http.post(`/payIn/process-by-image/${id}`, data));
    return res
}

export const testResult = async (id, data) => {
    return await APIParser(http.post(`/payIn/update-payment-status/${id}`, data));
}


export const processTransaction = async (id, data) => {
    return await APIParser(http.post(`/payIn/process/${id}`, data));
}

export const payInOneTimeExpireURL = async (id) => {
    return await APIParser(http.post(`/payIn/expire-one-time-payin-url/${id}`));
}

export const generateIntentOrder = async (id, data) => {
    return await APIParser(http.post(`/payIn/generate-intent-order/${id}`, data));
}

export const generatePayIn = async (userId, code, ot, key, amount) => {
  try {
    const params = {
      user_id: userId,
      code: code,
      ot: ot,
      key: key,
      ...(amount && { amount: amount })
    };

    const response = await axios.get(`http://localhost:8090/v1/payIn/generate-payin`, {
      params: params
    });
    return response;
  } catch (error) {
    console.error('Error generating pay in:', error);
    throw error;
  }
};