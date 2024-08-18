import axios from "axios";

const API_URL =
  "http://localhost:3001/";

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common.Accept = "application/json";
axios.defaults.headers.common.Authorization= `Bearer ${localStorage.getItem('jwt') ? localStorage.getItem('jwt') : null}`

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;