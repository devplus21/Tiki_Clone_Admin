import { Button, Form, Input, Modal, notification } from "antd";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import CATEGORY_API from "../../../../api/category";
import { STATUS_FAIL } from "../../../../constants/api";
import UploadThumbnail from "../../../../global-components/UploadThumbnail";
import "./style.scss";

const CategoryModal = ({ visible, onClose, data, onSuccess }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(
    data
      ? {
          image_url: data.image_url,
          image_id: data.image_id,
        }
      : null
  );

  const handleClose = () => {
    onClose && onClose();
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  const handleSubmit = async (values) => {
    try {
      let payload = {
        ...values,
        image_url: image.image_url,
        image_id: image.image_id,
      };

      let response;
      if (!data) {
        if (!payload.name) return setErrorMessage("Tên không được bỏ trống");
        if (!payload.image_url)
          return setErrorMessage("Hình ảnh không được bỏ trống");

        response = await CATEGORY_API.createCategory(payload);
      } else {
        if (payload.name === data.name) payload.name = null;
        payload = _.omitBy(payload, _.isNil);
        response = await CATEGORY_API.updateCategory(data._id, payload);
      }

      if (response.status === STATUS_FAIL)
        return notification.error({
          placement: "topRight",
          message: "Lỗi!",
          description: response.message,
          duration: 3,
        });

      onSuccess && onSuccess(response.data);
      handleClose();
    } catch (error) {
      return console.log(error.message);
    }
  };

  const handleUploadSuccess = (value) => {
    if (value)
      setImage({
        image_url: value.url,
        image_id: value.public_id,
      });
  };

  useEffect(() => {
    if (errorMessage)
      return notification.error({
        placement: "topRight",
        message: "Lỗi!",
        description: errorMessage,
        duration: 3,
      });
  }, [errorMessage]);

  useEffect(() => {
    if (data)
      setImage({
        image_url: data.image_url,
        image_id: data.image_id,
      });
  }, [data]);

  useEffect(() => {
    if (!visible) setImage(null);
  }, [visible]);

  const initValues = useMemo(() => data, [data]);

  return (
    (visible && (
      <Modal
        title={data ? "Thêm thể loại" : "Chi tiết thể loại"}
        visible={visible}
        centered
        wrapClassName="category__form"
        footer={""}
        onCancel={handleCancel}
        destroyOnClose
      >
        <UploadThumbnail
          onSuccess={handleUploadSuccess}
          defaultFile={
            image ? { url: image.image_url, public_id: image.image_id } : null
          }
        />
        <Form
          name="form_category"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
          initialValues={initValues}
        >
          <Form.Item label="Tên" name="name">
            <Input placeholder="Nhập tên thể loại..." />
          </Form.Item>
          <Form.Item className="category__form-btn">
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )) ||
    null
  );
};

export default CategoryModal;
