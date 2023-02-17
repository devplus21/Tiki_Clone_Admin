import cloudiaryAxios from "./instances/axiosCloudiary";

const uploadImage = (data) => {
  return cloudiaryAxios({
    method: "POST",
    url: "/",
    data,
  });
};

const CLOUDIARY_API = {
  uploadImage,
};

export default CLOUDIARY_API;
