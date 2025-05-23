import axios from "axios";
const BASE_URL = `${import.meta.env.VITE_API_BACKEND_URL}`;

const http = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export default http;