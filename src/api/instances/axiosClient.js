import axios from "axios";
import { REST_URL } from "../../constants/api";

const axiosClient = axios.create({
  baseURL: REST_URL,
});

axiosClient.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem("access_token");
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },

  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;
