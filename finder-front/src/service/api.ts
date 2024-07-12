import axios from "axios";
import { getCookie } from "typescript-cookie";


const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Authorization": `Bearer ${getCookie("auth-token")}`
    }
});

api.interceptors.request.use(
    (request) => {
        const token = getCookie("auth-token")
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`

        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api