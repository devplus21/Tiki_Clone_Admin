import axiosClient from "./instances/axiosClient";

const removeProduct = (productId) => {
  return axiosClient({
    method: "DELETE",
    url: `/products/${productId}`,
  });
};

const getProductImages = (productId) => {
  return axiosClient({
    method: "GET",
    url: `/product-images?product_id=${productId}`,
  });
};

const removeImage = (publicId) => {
  return axiosClient({
    method: "DELETE",
    url: `/product-images/delete?public_id=${publicId}`,
  });
};

const createImage = (data) => {
  return axiosClient({
    method: "POST",
    url: `/product-images`,
    data,
  });
};

const createProduct = (data) => {
  return axiosClient({
    method: "POST",
    url: "/products",
    data,
  });
};

const getOneProduct = (slug) => {
  return axiosClient({
    method: "GET",
    url: `/products/${slug}`,
  });
};

const getAllProduct = () => {
  return axiosClient({
    method: "POST",
    url: '/products/all',
  });
};

const updateProduct = (_id, newData) => {
  return axiosClient({
    method: "PUT",
    url: `/products/${_id}`,
    data: newData,
  });
};

const queryProducts = (query) => {
  return axiosClient({
    method: "GET",
    url: `/products${query}`,
  });
};

const rate = (data) => {
  return axiosClient({
    method: "POST",
    url: "/ratings",
    data,
  });
};

const queryRates = (query) => {
  return axiosClient({
    method: "GET",
    url: `/ratings${query}`,
  });
};

const getIsBought = (userId, productId) => {
  return axiosClient({
    method: "GET",
    url: `/ratings/bought?user_id=${userId}&product_id=${productId}`,
  });
};

const PRODUCT_API = {
  getOneProduct,
  queryProducts,
  rate,
  queryRates,
  getIsBought,
  createProduct,
  updateProduct,
  removeImage,
  createImage,
  getProductImages,
  removeProduct,
  getAllProduct
};

export default PRODUCT_API;
