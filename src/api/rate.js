import axiosClient from "./instances/axiosClient";

const queryAllRates = (query = "") => {
  return axiosClient({
    method: "GET",
    url: "/ratings/all" + query,
  });
};

const removeRate = (saleId) => {
  return axiosClient({
    method: 'DELETE',
    url: `/ratings/${saleId}`,
  });
};

const RATE_API = {
  queryAllRates,
  removeRate
};

export default RATE_API;
