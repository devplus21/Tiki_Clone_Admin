import axios from "axios";
import { CLOUDINARY_URL } from "../../constants/api";

const cloudiaryAxios = axios.create({
  baseURL: CLOUDINARY_URL,
});

cloudiaryAxios.interceptors.request.use(
  function (config) {
    config.headers = {
      "Content-Type": "multipart/form-data",
    };
    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

cloudiaryAxios.interceptors.response.use(
  function (response) {
    return response.data;
  },

  function (error) {
    return Promise.reject(error);
  }
);

export default cloudiaryAxios;
