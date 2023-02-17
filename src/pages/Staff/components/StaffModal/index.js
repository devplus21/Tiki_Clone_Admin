import { Button, Form, Input, Modal, notification } from "antd";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import USER_API from "../../../../api/user";
import { STATUS_FAIL } from "../../../../constants/api";
import { phoneReg } from "../../../../utils/validations";

const StaffModal = ({ visible, data, onSuccess, onClose }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (payload) => {
    try {
      let response;
      if (!data) {
        payload["password"] = "admin123";
        response = await USER_API.createStaff(payload);
      } else {
        if (payload.name === data.name) payload.name = null;
        payload = _.omitBy(payload, _.isNil);
        response = await USER_API.updateUser(data._id, payload);
      }

      if (response.status === STATUS_FAIL)
        return notification.error({
          placement: "topRight",
          message: "Lỗi!",
          description: response.message,
          duration: 3,
        });

      onSuccess && onSuccess(response.data);
      onClose && onClose();
    } catch (error) {
      return console.log(error.message);
    }
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

  const initValues = useMemo(() => data, [data]);

  return (
    <Modal
      title="Thêm nhân viên"
      visible={visible}
      centered
      wrapClassName="form_staff"
      footer={""}
      destroyOnClose
      onCancel={onClose}
    >
      <Form
        name="form_staff"
        onFinish={handleSubmit}
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
        scrollToFirstError
        initialValues={initValues}
      >
        <Form.Item
          label="Tên"
          name="first_name"
          rules={[{ required: true, message: "Nhập tên nhân viên" }]}
        >
          <Input placeholder="Nhập họ nhân viên..." />
        </Form.Item>
        <Form.Item
          label="Họ"
          name="last_name"
          rules={[{ required: true, message: "Nhập họ nhân viên" }]}
        >
          <Input placeholder="Nhập họ nhân viên..." />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: "email", message: "Email không chính xác" },
            { required: true, message: "Nhập email nhân viên" },
          ]}
        >
          <Input placeholder="Nhập email nhân viên..." />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            {
              pattern: phoneReg,
              message: "The input is not valid phone number!",
              whitespace: true,
            },
            { required: true, message: "Nhập số điện thoại nhân viên" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại nhân viên..." />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Nhập địa chỉ nhân viên" }]}
        >
          <Input placeholder="Nhập địa chỉ nhân viên..." />
        </Form.Item>
        <Form.Item className="staff__form-btn">
          <Button>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: 8 }}
            // onClick={handleOkFormCategory}
          >
            Lưu lại
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StaffModal;
