import axiosClient from './instances/axiosClient';

const querySales = (queries) => {
  return axiosClient({
    method: 'GET',
    url: `/sales${queries}`,
  });
};

const removeSale = (saleId) => {
  return axiosClient({
    method: 'DELETE',
    url: `/sales/${saleId}`,
  });
};

const createSale = (data) => {
  return axiosClient({
    method: 'POST',
    url: `/sales`,
    data,
  });
};

const updateSale = (_id, data) => {
  return axiosClient({
    method: 'PUT',
    url: `/sales/${_id}`,
    data,
  });
};

const Sale_API = {
  querySales,
  createSale,
  updateSale,
  removeSale,
};

export default Sale_API;
