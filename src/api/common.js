import axiosClient from "./instances/axiosClient";

const getStatistic = (data) => {
  return axiosClient({
    method: "POST",
    url: "/statistic",
    data
  });
};

const COMMON_API = {
  getStatistic,
};

export default COMMON_API;
