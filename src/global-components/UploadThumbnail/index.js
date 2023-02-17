import { PlusOutlined } from "@ant-design/icons";
import { notification, Upload } from "antd";
import React, { useEffect, useState } from "react";
import CLOUDIARY_API from "../../api/cloudiary";
import PRODUCT_API from "../../api/product";
import { CLOUDINARY_PRESET, STATUS_FAIL } from "../../constants/api";

const UploadThumbnail = ({ onSuccess, defaultFile }) => {
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

    onSuccess(null);
  };

  const uploadFile = async ({ file }) => {
    const currentFileList = [...fileList];
    currentFileList[0] = { ...currentFileList[0], percent: 90 };
    setFileList(currentFileList);

    const formData = new FormData();
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("file", file);

    const response = await CLOUDIARY_API.uploadImage(formData);

    if (response.url) {
      const currentFileList = [...fileList];

      currentFileList[0] = {
        ...currentFileList[0],
        percent: 100,
        url: response.url,
        status: "done",
        publicId: response.public_id,
      };

      setFileList(currentFileList);
      onSuccess({
        public_id: currentFileList[0].publicId,
        url: currentFileList[0].url,
      });
    } else {
      return notification.error({
        placement: "topRight",
        message: "Lỗi!",
        description: "Lỗi upload ảnh",
        duration: 3,
      });
    }
  };

  useEffect(() => {
    if (defaultFile) setFileList([defaultFile]);
  }, [defaultFile]);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="upload__thumbnail">
      <Upload
        customRequest={uploadFile}
        listType="picture-card"
        fileList={fileList}
        onRemove={handleRemoveFile}
        onChange={handleChange}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
    </div>
  );
};

export default UploadThumbnail;
