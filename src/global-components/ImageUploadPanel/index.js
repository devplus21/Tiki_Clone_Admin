import { PlusOutlined } from "@ant-design/icons";
import { notification, Upload } from "antd";
import React, { useEffect, useState } from "react";
import CLOUDIARY_API from "../../api/cloudiary";
import PRODUCT_API from "../../api/product";
import { CLOUDINARY_PRESET, STATUS_FAIL } from "../../constants/api";

const ImageUploadPanel = ({ productId, maxCount = 8, formReset, data }) => {
  const [fileList, setFileList] = useState([]);
  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemoveFile = async (file) => {
    const response = await PRODUCT_API.removeImage(file.publicId);

    if (response.status === STATUS_FAIL)
      return notification.error({
        placement: "topRight",
        message: "Lỗi xóa ảnh!",
        description: response.message,
        duration: 3,
      });
  };

  const uploadFile = async ({ file }) => {
    const index = fileList.findIndex((item) => item.uid === file.uid);
    const currentFileList = [...fileList];
    currentFileList[index] = { ...currentFileList[index], percent: 90 };
    setFileList(currentFileList);

    const formData = new FormData();
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("file", file);

    const response = await CLOUDIARY_API.uploadImage(formData);

    if (response.url) {
      const result = await PRODUCT_API.createImage({
        product_id: productId,
        public_id: response.public_id,
        url: response.url,
      });

      if (result.status === STATUS_FAIL)
        return notification.error({
          placement: "topRight",
          message: "Lỗi!",
          description: result.message,
          duration: 3,
        });

      const index = fileList.findIndex((item) => item.uid === file.uid);
      const currentFileList = [...fileList];

      currentFileList[index] = {
        ...currentFileList[index],
        percent: 100,
        url: response.url,
        status: "done",
        publicId: response.public_id,
      };

      setFileList(currentFileList);
    }
  };

  useEffect(async () => {
    if (!data) return;
    try {
      const response = await PRODUCT_API.getProductImages(productId);

      if (response.status === STATUS_FAIL) return console.log(response.message);

      setFileList(
        response.data?.map((item) => ({
          percent: 100,
          url: item.url,
          uid: item._id,
          publicId: item.public_id,
          status: "done",
        }))
      );
    } catch (error) {
      console.log(error.message);
    }
  }, [productId]);

  useEffect(() => {
    setFileList([])
  }, [formReset])

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        customRequest={uploadFile}
        listType="picture-card"
        fileList={fileList}
        onRemove={handleRemoveFile}
        onChange={handleChange}
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>
    </>
  );
};

export default ImageUploadPanel;
