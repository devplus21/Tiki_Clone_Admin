import axiosClient from "./instances/axiosClient";

const queryCategories = (queries) => {
  return axiosClient({
    method: "GET",
    url: `/categories${queries}`,
  });
};

const removeCategory = (categoryId) => {
  return axiosClient({
    method: "DELETE",
    url: `/categories/${categoryId}`,
  });
};

const createCategory = (data) => {
  return axiosClient({
    method: "POST",
    url: `/categories`,
    data,
  });
};

const updateCategory = (_id, data) => {
  return axiosClient({
    method: "PUT",
    url: `/categories/${_id}`,
    data,
  });
};

const getAllCategory = () => {
  return axiosClient({
    method: "GET",
    url: `/categories/all`,
  });
}


const CATEGORY_API = {
  queryCategories,
  createCategory,
  updateCategory,
  removeCategory,
  getAllCategory
};

export default CATEGORY_API;
