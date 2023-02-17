import axiosClient from "./instances/axiosClient";

const updateOrder = (_id, data) => {
  return axiosClient({
    method: "PUT",
    data,
    url: `/orders/${_id}`,
  });
};

const createOrder = (data) => {
  return axiosClient({
    method: "POST",
    data,
    url: "/orders",
  });
};

const createOrderItems = (data) => {
  return axiosClient({
    method: "POST",
    data,
    url: "/order-items",
  });
};

const queryUserOrdersList = (userId) => {
  return axiosClient({
    method: "GET",
    url: `/orders/user?user=${userId}`,
  });
};

const queryOrdersList = (query) => {
  return axiosClient({
    method: "GET",
    url: `/orders${query}`,
  });
};

const getOneOrder = (_id) => {
  return axiosClient({
    method: "GET",
    url: `/orders/${_id}`,
  });
}

const ORDER_API = {
  createOrder,
  createOrderItems,
  queryUserOrdersList,
  queryOrdersList,
  updateOrder,
  getOneOrder
};

export default ORDER_API;
