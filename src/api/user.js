import axiosClient from "./instances/axiosClient";

const queryUsers = (query) => {
  return axiosClient({
    method: "GET",
    url: `/users${query}`,
  });
};

const updateUser = (userId, data) => {
  return axiosClient({
    method: "PUT",
    url: `/users/${userId}`,
    data,
  });
};

const getUserInfo = (userId) => {
  return axiosClient({
    method: "GET",
    url: `/users/${userId}`,
  });
};

const createStaff = (data) => {
  return axiosClient({
    method: "POST",
    url: "/users/admin",
    data,
  });
};

const removeUser = (_id) => {
  return axiosClient({
    method: "DELETE",
    url: `/users/${_id}`,
  });
};

const removeStaff = (_id) => {
  return axiosClient({
    method: "DELETE",
    url: `/users/staff/${_id}`,
  });
};

const getMuntipleUser = () => {
  return axiosClient({
    method: "GET",
    url: '/users?role=2&',
  });
}

const USER_API = {
  updateUser,
  getUserInfo,
  queryUsers,
  createStaff,
  removeStaff,
  removeUser,
  getMuntipleUser
};

export default USER_API;
