import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Typography,
  AutoComplete,
  notification,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

EditOwner.propTypes = {};

function EditOwner({ isOpenModal, onCloseModal }) {
  const { Title } = Typography;
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(isOpenModal);

  const headers = {
    "Content-Type": "application/json",
    // Token: "f47eaf64-d85c-11ec-ac32-0e0f5adc015a",
    Token: "1940c02b-7dbe-11ed-b09a-9a2a48e971b0",
    shop_id: 3581868,
    shopid: 3581868,
    ShopId: "3581868",
  };

  // Call API shop GHN
  const urlDataShop =
    "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shop";

  const [dataOwnerShop, setDataOwnerShop] = useState([]);

  useEffect(() => {
    (async () => {
      const responveDataShop = await axios.post(
        urlDataShop,
        {
          id: 2921833,
          source: "5sao",
        },
        { headers }
      );
      if (Number(responveDataShop.status) !== 200)
        return console.log("Failed to fetch data shop owner");

      setDataOwnerShop(responveDataShop?.data?.data);
    })();
  }, []);

  // console.log("dataOwnerShop", dataOwnerShop);

  let initAddressArr = "";

  if (dataOwnerShop?.address?.length > 1) {
    initAddressArr = dataOwnerShop?.address?.split(", ");
  }

  // Call API get data province
  const [provinceList, setProvinceList] = useState([]);

  useEffect(() => {
    (async () => {
      const {
        data: { data },
      } = await axios.get(
        "https://fe-online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          headers,
        }
      );
      setProvinceList(data);
    })();
  }, []);

  const options = provinceList?.map((province) => ({
    value: province?.ProvinceName,
    ProvinceID: province?.ProvinceID,
  }));

  const [provinceID, setProvinceID] = useState(undefined);

  // Call API get data dictrict

  const [districtList, setDistrictList] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.post(
        "https://fe-online-gateway.ghn.vn/shiip/public-api/master-data/district",
        { province_id: provinceID },
        {
          headers,
        }
      );
      const {
        data: { data },
      } = response;
      setDistrictList(data);
    })();
  }, [provinceID]);

  const optionsDistrict = districtList?.map((district) => ({
    value: district?.DistrictName,
    DistrictID: district?.DistrictID,
  }));

  // Call API get data ward

  const [districtID, setDistrictID] = useState(undefined);
  const [wardList, setWardList] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.post(
        "https://fe-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id",
        { district_id: districtID },
        {
          headers,
        }
      );
      const {
        data: { data },
      } = response;
      setWardList(data);
    })();
  }, [districtID]);

  const optionsWard = wardList?.map((ward) => ({
    value: ward?.WardName,
    WardCode: ward?.WardCode,
  }));

  const [WardCode, setWardCode] = useState(undefined);

  // Handle reset form adrress when change value

  const handleClearProvince = () => {};

  // Handle close modal

  const handleCancel = () => {
    if (onCloseModal) onCloseModal(true);
  };

  const getDataFormCommon = form.getFieldsValue([
    "province",
    "ward_code",
    "district_id",
    "address",
  ]);

  const [dataAdress, setDataAddress] = useState("");

  // Handle update shop
  const onFinish = async (values) => {
    delete values?.province;
    console.log(values);

    const newValueSubmit = {
      ...values,
      district_id: Number(districtID) || dataOwnerShop?.district_id,
      ward_code: WardCode || dataOwnerShop?.ward_code,
      status: dataOwnerShop?.status,
      // address:
      //   getDataFormCommon?.address === dataOwnerShop?.address
      //     ? dataOwnerShop?.address
      //     : `${getDataFormCommon?.address}, ${getDataFormCommon?.ward_code}, ${getDataFormCommon?.district_id}, ${getDataFormCommon?.province}`.trim(),
      address: dataAdress
        ? `${dataAdress}, ${getDataFormCommon?.ward_code}, ${getDataFormCommon?.district_id}, ${getDataFormCommon?.province}`.trim()
        : dataOwnerShop?.address,
      bank_account_id: dataOwnerShop?.bank_account_id,
      id: dataOwnerShop?.id,
      source: dataOwnerShop?.source,
      version_no: dataOwnerShop?.version_no,
    };

    console.log("newValueSubmit", newValueSubmit);
    console.log("getDataFormCommon", getDataFormCommon);

    const urlUpdateShop =
      "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shop/update";

    try {
      const responseDataUpdateShop = await axios.post(
        urlUpdateShop,
        newValueSubmit,
        { headers }
      );

      // console.log("responseDataUpdateShop", responseDataUpdateShop);

      if (Number(responseDataUpdateShop?.status) !== 200) {
        notification.error({
          placement: "topRight",
          message: "Thất bại!",
          description: "Cập nhật thất bại!",
          duration: 3,
        });
        return;
      }

      notification.success({
        placement: "topRight",
        message: "Thành công!",
        description: "Cập nhật thành công!",
        duration: 3,
      });

      setTimeout(() => {
        document.location.reload();
      }, 500);
    } catch (error) {
      notification.error({
        placement: "topRight",
        message: error?.message || "Thất bại!",
        description: "Cập nhật thất bại!",
        duration: 3,
      });
    }
  };

  return (
    <>
      <Modal
        title="Chỉnh sửa địa chỉ gửi hàng"
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        footer={null}
      >
        {dataOwnerShop?._id && (
          <>
            <Form
              name="basic"
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                ...dataOwnerShop,
                ward_code: initAddressArr[1] || "",
                district_id: initAddressArr[2] || "",
                province: initAddressArr[3] || "",
              }}
              onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Title level={5} style={{ color: "#f26522" }}>
                | Thông tin chung
              </Title>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="Tên cửa hàng"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên cửa hàng!",
                      },
                    ]}
                  >
                    <Input allowClear />
                  </Form.Item>

                  <Form.Item
                    label="Điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                    ]}
                  >
                    <Input allowClear />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[
                      { required: true, message: "Vui lòng nhập địa chỉ!" },
                    ]}
                  >
                    <Input
                      allowClear
                      onChange={(e) => setDataAddress(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Tỉnh/Thành phố"
                    name="province"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn tên tỉnh/thành phố!",
                      },
                    ]}
                  >
                    <AutoComplete
                      style={{
                        width: 200,
                      }}
                      options={options}
                      filterOption={(inputValue, option) =>
                        option.value
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                      onSelect={(value, options) =>
                        setProvinceID(options?.ProvinceID)
                      }
                      onClear={handleClearProvince}
                      allowClear
                    />
                  </Form.Item>

                  <Form.Item
                    label="Quận huyện"
                    name="district_id"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn tên quận huyện!",
                      },
                    ]}
                  >
                    <AutoComplete
                      style={{
                        width: 200,
                      }}
                      options={optionsDistrict}
                      filterOption={(inputValue, option) =>
                        option.value
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                      onSelect={(value, options) =>
                        setDistrictID(options?.DistrictID)
                      }
                      allowClear
                    />
                  </Form.Item>

                  <Form.Item
                    label="Phường/xã"
                    name="ward_code"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn tên phường/xã!",
                      },
                    ]}
                  >
                    <AutoComplete
                      style={{
                        width: 200,
                      }}
                      options={optionsWard}
                      filterOption={(inputValue, option) =>
                        option.value
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                      onSelect={(value, options) =>
                        setWardCode(options?.WardCode)
                      }
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </>
  );
}

export default EditOwner;
