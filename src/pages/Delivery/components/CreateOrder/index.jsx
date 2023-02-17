import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ORDER_API from "../../../../api/order";
import USER_API from "../../../../api/user";
import "./styles.scss";
import { Spin } from "antd";
import { EditFilled, LoadingOutlined } from "@ant-design/icons";
import EditOwner from "../EditOwner";

CreateOrderDelivery.propTypes = {};

function fomart_current(cost) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(cost);
}

function caculatorTotal(arr) {
  if (!Array.isArray(arr) || arr.length < 1) return;
  const result = arr.reduce(
    (pre, cur) => pre + cur.item_price * cur.quantity,
    0
  );
  return result;
}

function getNameProducts(arr) {
  if (!Array.isArray(arr) || arr.length < 1) return;
  const arrNameProducts = arr.map((x) => x?.product?.name);
  const resultName = arrNameProducts.join(" + ");
  return resultName;
}

function CreateOrderDelivery(props) {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { Option } = Select;
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const param = useParams();

  const [orderData, setOrderData] = useState([]);
  const [defaultValuesOrder, setDefaultValuesOrder] = useState(undefined);
  const [userId, setUserId] = useState(undefined);
  const [infoUser, setInfoUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(() => false);

  const headers = {
    "Content-Type": "application/json",
    // Token: "f47eaf64-d85c-11ec-ac32-0e0f5adc015a",
    Token: "1940c02b-7dbe-11ed-b09a-9a2a48e971b0",
    shop_id: 3581868,
    shopid: 3581868,
    ShopId: "3581868",
  };

  // Call API set default value by id order

  useEffect(() => {
    (async () => {
      const responveOrderData = await ORDER_API.getOneOrder(param?.id);
      if (responveOrderData.status === "FAIL") return;
      const { data } = responveOrderData;
      // console.log("responveOrderData", data);

      setOrderData(data);
      setUserId(data[0]?.user);

      setDefaultValuesOrder({
        to_address: data[0]?.address.street,
        province: data[0]?.address.province.name,
        to_district_id: data[0]?.address.district.name,
        to_ward_code: data[0]?.address.ward.name,
        cod_amount:
          data[0]?.payment_type === "COD"
            ? caculatorTotal(data[0]?.order_items)
            : 0,
        insurance_value:
          data[0]?.payment_type === "COD"
            ? caculatorTotal(data[0]?.order_items).toLocaleString()
            : 0,
        name: getNameProducts(data[0]?.order_items),
        client_order_code: data[0]?.user,
        code: data[0]?._id,
      });
    })();
  }, [param?.id]);

  // Call api get user info

  useEffect(() => {
    (async () => {
      const responseUserInfo = await USER_API.getUserInfo(userId);
      if (responseUserInfo.status === "FAIL") return;
      console.log("responseUserInfo", responseUserInfo);
      const {
        data: { phone, email, first_name, last_name },
      } = responseUserInfo;
      setInfoUser({
        to_phone: phone,
        to_name: first_name + " " + last_name,
        // to_email: email,
      });
      console.log("responseUserInfo", responseUserInfo);
    })();
  }, [userId]);

  const data = {
    payment_type_id: null,
    note: null, // no
    required_note: null,
    return_phone: "0398294385", // no
    return_address: "702, xa lộ Hà Nội, Hiệp Phú, Thủ Đức, HCM", // no
    return_district_id: null, // no
    return_ward_code: "", // no
    client_order_code: "",
    to_name: "",
    to_phone: "",
    to_address: "",
    to_ward_code: "",
    to_district_id: null,
    cod_amount: null, // no
    content: "", // no
    weight: 1,
    length: 1,
    width: 1,
    height: 1,
    pick_station_id: null,
    deliver_station_id: null,
    insurance_value: null,
    service_id: 0,
    // service_type_id: 2,
    service_type_id: null,
    coupon: null,
    pick_shift: [2],
    items: [],
  };

  // const headers = {
  //   "Content-Type": "application/json",
  //   ShopId: "3581868",
  //   Token: "2828b0b4-c90b-11ec-ac64-422c37c6de1b",
  // };

  // Call API shop GHN
  const urlDataShop =
    "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shop";
  const [dataOwnerShop, setDataOwnerShop] = useState([]);

  useEffect(() => {
    (async () => {
      const responveDataShop = await axios.post(
        urlDataShop,
        {
          id: 3581868,
          source: "5sao",
        },
        { headers }
      );
      if (Number(responveDataShop.status) !== 200)
        return console.log("Failed to fetch data shop owner");
      setDataOwnerShop(responveDataShop?.data?.data);
    })();
  }, []);
  console.log("dataOwnerShop", dataOwnerShop);

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

  const [infoCommon, setInfoCommon] = useState({
    to_name: "",
    to_phone: "",
    to_address: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInfoCommon((values) => ({ ...values, [name]: value }));
  };

  const formNewCommon = form.getFieldsValue([
    "province",
    "to_district_id",
    "to_ward_code",
    "to_address",
    "cod_amount",
    "name",
    "code",
    "quantity",
    "weight",
  ]);

  const dataItem = [
    {
      name: formNewCommon?.name,
      code: formNewCommon?.code,
      quantity: Number(formNewCommon?.quantity),
      category: {},
      weight: Number(formNewCommon?.weight),
    },
  ];

  // console.log("formNewCommon---", formNewCommon);

  const initValue = {
    quantity_gam: 0,
    quantity: 0,
    lengthOrder: 0,
    widthOrder: 0,
    heightOrder: 0,
    weight: 0,
    cod_amount: 1,
  };

  const [initValueQuantity, setInitValue] = useState(() => initValue);

  form.setFieldsValue({
    weight: initValueQuantity.quantity * initValueQuantity.quantity_gam,
  });

  const newAddressFormat = `${formNewCommon?.to_address}, ${formNewCommon?.to_ward_code}, ${formNewCommon?.to_district_id}, ${formNewCommon?.province}`;

  if (formNewCommon?.cod_amount) {
    form.setFieldsValue({
      insurance_value: Number(formNewCommon?.cod_amount).toLocaleString(),
    });
  }

  // Call api get service
  const [dataService, setDataService] = useState([]);
  const [codeMessageValue, setCodeMessageValue] = useState("");
  const urlService =
    "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";

  // const urlFeeService =
  //   "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";

  const urlFeeService =
    "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";

  const [paymentFeeService, setPaymentFeeService] = useState(0);
  const [serviceId, setServiceId] = useState(0);

  let districIdFromBill,
    wardCodeFromBill = "";

  if (orderData?.length > 0) {
    districIdFromBill = orderData[0]?.address?.district?.code;
    wardCodeFromBill = orderData[0]?.address?.ward?.code;
  }

  useEffect(() => {
    (async () => {
      try {
        const responseService = await axios.post(
          urlService,
          {
            shop_id: 3581868,
            shopid: 3581868,
            from_district: 1451,
            to_district: Number(districtID) || Number(districIdFromBill),
          },
          {
            headers,
          }
        );
        const {
          data: { code_message_value, data },
        } = responseService;
        setDataService(data);
        setCodeMessageValue(code_message_value);

        const responseFeeService = await axios.post(
          urlFeeService,
          {
            from_district_id: 1451,
            service_id: Number(serviceId) || 0,
            service_type_id: null,
            to_district_id: Number(districtID) || Number(districIdFromBill),
            to_ward_code: WardCode || wardCodeFromBill,

            height: Number(initValueQuantity?.heightOrder),
            length: Number(initValueQuantity?.lengthOrder),
            width: Number(initValueQuantity?.widthOrder),
            weight: Number(formNewCommon?.weight),
            insurance_value: Number(formNewCommon?.insurance_value),
            coupon: null,
          },
          {
            headers,
          }
        );

        const { total } = responseFeeService?.data?.data;
        // console.log("total===", total);
        setPaymentFeeService(total);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [
    districtID,
    serviceId,
    WardCode,
    initValueQuantity,
    districIdFromBill,
    wardCodeFromBill,
  ]);

  // Call API leadtime
  const urlLeadTime =
    "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime";

  const [leadTime, setLeadTime] = useState(undefined);

  useEffect(() => {
    (async () => {
      try {
        const responseLeadTime = await axios.post(
          urlLeadTime,
          {
            from_district_id: 1451,
            from_ward_code: "20901",
            to_district_id: Number(districtID) || Number(districIdFromBill),
            to_ward_code: WardCode || wardCodeFromBill,
            service_id: Number(serviceId),
          },
          { headers }
        );
        const {
          data: {
            data: { leadtime },
          },
        } = responseLeadTime;
        setLeadTime(leadtime);
        // console.log("data---", data);
      } catch (error) {
        console.log("Failed to fetch lead time", error);
      }
    })();
  }, [districtID, WardCode, serviceId, districIdFromBill, wardCodeFromBill]);

  // Handle fee service
  const [serviceNameFee, setServiceNameFee] = useState(undefined);

  const handleChangeServiceFee = (event, service_name) => {
    const service_id = event.target.value;
    setServiceNameFee(service_name);
    setServiceId(service_id);
  };

  const [statusPaymentTypeId, setStatusPaymentTypeId] = useState(
    () => "Bên gửi trả phí"
  );

  const handleChangePaymentTypeId = (value) => {
    if (value === "1") setStatusPaymentTypeId("Bên gửi trả phí");
    if (value === "2") setStatusPaymentTypeId("Bên nhận trả phí");
    return;
  };

  // Handle submit form
  const handleOnFinishForm = async (values) => {
    setIsLoading(true);
    console.log("values submit: ", values);
    const newValue = {
      ...data,
      ...values,
      to_ward_code: WardCode || wardCodeFromBill,
      to_district_id: Number(districtID) || districIdFromBill,
      to_address: newAddressFormat,
      cod_amount: Number(values?.cod_amount),
      weight: Number(values?.weight),
      length: Number(values?.length),
      width: Number(values?.width),
      height: Number(values?.height),
      payment_type_id: Number(values?.payment_type_id) || 1,
      service_id: Number(serviceId),
      insurance_value:
        Number(values?.insurance_value.split(",").join("")) > 5_000_000
          ? 5_000_000
          : Number(values?.insurance_value.split(",").join("")),
      items: dataItem,
    };

    delete newValue?.quantity;
    delete newValue?.quantity_gam;
    delete newValue?.["radio-button"];

    console.log("new ValueSumit---", newValue);
    const urlCreateOrder =
      "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create";

    try {
      const responseCreateOrder = await axios.post(urlCreateOrder, newValue, {
        headers,
      });

      if (Number(responseCreateOrder?.code) === 400)
        return notification.error({
          placement: "topRight",
          message: "Lỗi",
          description: "Tạo đơn hàng bị lỗi!",
          duration: 3,
        });

      const orderCodeOrder = responseCreateOrder?.data?.data?.order_code;
      // console.log("responseCreateOrder", responseCreateOrder);

      // Call API save field order_code of sevice into database collection Order

      if (orderCodeOrder) {
        const responveUpdateOrderCode = await ORDER_API.updateOrder(param?.id, {
          order_code: orderCodeOrder,
        });

        if (responveUpdateOrderCode.status === "FAIL")
          return notification.error({
            placement: "topRight",
            message: "Lỗi",
            description: "Cập nhật trường order_code bị lỗi!",
            duration: 3,
          });
      }

      // Notify success
      notification.success({
        placement: "topRight",
        message: "Thành công!",
        description: "Tạo đơn hàng thành công!",
        duration: 3,
      });
    } catch (error) {
      notification.error({
        placement: "topRight",
        message: error?.message || "Lỗi",
        description: "Tạo đơn hàng bị lỗi!",
        duration: 3,
      });
    }
    setIsLoading(false);
  };

  // Handle open or close modal edit owner
  const [isOpenModal, setIsOpenModal] = useState(() => false);

  const handleModalEditOwner = () => {
    setIsOpenModal(true);
  };

  const handleOnCloseModal = (flag) => {
    if (flag) setIsOpenModal(false);
  };

  return (
    <>
      <div
        className="section-send_order"
        style={{ paddingTop: 20, paddingLeft: 20 }}
      >
        {dataOwnerShop._id && (
          <>
            <Title level={5} style={{ color: "#f26522" }}>
              | Bên gửi{" "}
              <EditFilled
                style={{ color: "#333", cursor: "pointer" }}
                onClick={handleModalEditOwner}
              />
            </Title>
            {isOpenModal && (
              <>
                <EditOwner
                  isOpenModal={isOpenModal}
                  onCloseModal={handleOnCloseModal}
                />
              </>
            )}

            <div style={{ marginLeft: 8 }}>
              <div
                className="name-shop__telephone"
                style={{
                  color: "#f26522",
                  marginBottom: 8,
                  fontStyle: "italic",
                }}
              >
                <strong>
                  {dataOwnerShop?.name} - {dataOwnerShop?.phone}
                </strong>
              </div>
              <div className="adress-shop" style={{ color: "#00467f" }}>
                <span>{dataOwnerShop?.address}</span>
              </div>
            </div>
          </>
        )}
      </div>
      {defaultValuesOrder && infoUser && (
        <>
          <Form
            name="basic"
            form={form}
            initialValues={{
              ...initValueQuantity,
              ...defaultValuesOrder,
              ...infoUser,
            }}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            onFinish={handleOnFinishForm}
          >
            <div className="pages_create_order" style={{ padding: "20px" }}>
              <Row>
                <Col span={20}>
                  <div className="section-receive-order ">
                    <Title level={5} style={{ color: "#f26522" }}>
                      | Bên nhận
                    </Title>
                    <Row>
                      <Col span={8}>
                        <div className="form-telephone">
                          <Form.Item
                            label="Số điện thoại"
                            name="to_phone"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                              },
                            ]}
                          >
                            <Input
                              onChange={handleChange}
                              name="to_phone"
                              allowClear
                            />
                          </Form.Item>
                        </div>
                        <div className="form-full-name">
                          <Form.Item
                            label="Họ tên"
                            name="to_name"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập họ tên!",
                              },
                            ]}
                          >
                            <Input
                              onChange={handleChange}
                              name="to_name"
                              allowClear
                            />
                          </Form.Item>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="form-telephone">
                          <Form.Item
                            label="Địa chỉ"
                            name="to_address"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập địa chỉ!",
                              },
                            ]}
                          >
                            <Input
                              onChange={handleChange}
                              name="to_address"
                              allowClear
                            />
                          </Form.Item>
                        </div>
                        <div className="form-choose-province">
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
                              allowClear
                            />
                          </Form.Item>
                        </div>
                        <div className="form-choose-district">
                          <Form.Item
                            label="Quận huyện"
                            name="to_district_id"
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
                        </div>
                        <div className="form-choose-ward">
                          <Form.Item
                            label="Phường/xã"
                            name="to_ward_code"
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
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="section-product">
                    <Title level={5} style={{ color: "#f26522" }}>
                      | Sản phẩm
                    </Title>
                    <Row>
                      <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Form.Item
                          label="Tên SP"
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tên sản phẩm!",
                            },
                          ]}
                        >
                          <Input placeholder="Nhập tên sản phẩm" />
                        </Form.Item>
                        <Form.Item
                          label="Mã SP"
                          name="code"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập mã sản phẩm!",
                            },
                          ]}
                        >
                          <Input placeholder="Nhập mã sản phẩm" />
                        </Form.Item>
                        <Form.Item
                          label="KL (gam)"
                          name="quantity_gam"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập khối lượng!",
                            },
                          ]}
                        >
                          <Input
                            placeholder=""
                            type="number"
                            min={1}
                            onChange={(e) => {
                              setInitValue({
                                ...initValueQuantity,
                                quantity_gam: e.target.value,
                              });
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          label="SL"
                          name="quantity"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số lượng!",
                            },
                          ]}
                        >
                          <Input
                            placeholder=""
                            onChange={(e) => {
                              setInitValue({
                                ...initValueQuantity,
                                quantity: e.target.value,
                              });
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  <div className="section-info-package">
                    <Title level={5} style={{ color: "#f26522" }}>
                      | Thông tin gói hàng
                    </Title>
                    <Row>
                      <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Form.Item label="Tổng KL(gam)" name="weight">
                          <Input placeholder="" name="weight" />
                        </Form.Item>
                        <Form.Item
                          label="Dài"
                          name="length"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chiều dài đơn hàng!",
                            },
                          ]}
                        >
                          <Input
                            placeholder=""
                            onChange={(e) => {
                              setInitValue({
                                ...initValueQuantity,
                                lengthOrder: e.target.value,
                              });
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Rộng"
                          name="width"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chiều rộng đơn hàng!",
                            },
                          ]}
                        >
                          <Input
                            placeholder=""
                            onChange={(e) => {
                              setInitValue({
                                ...initValueQuantity,
                                widthOrder: e.target.value,
                              });
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Cao"
                          name="height"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chiều cao!",
                            },
                          ]}
                        >
                          <Input
                            placeholder=""
                            onChange={(e) => {
                              setInitValue({
                                ...initValueQuantity,
                                heightOrder: e.target.value,
                              });
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Typography
                        style={{
                          color: "#f26522",
                          width: "100%",
                          textAlign: "center",
                          marginBottom: "16px",
                        }}
                      >
                        Khối lượng quy đổi:{" "}
                        {`${
                          (initValueQuantity?.heightOrder *
                            initValueQuantity?.lengthOrder *
                            initValueQuantity?.widthOrder) /
                          5
                        }
                  `}
                        (g)
                      </Typography>
                    </Row>
                    <Row>
                      <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Form.Item
                          label="Tổng tiền thu hộ COD"
                          name="cod_amount"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập trường này!",
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder=""
                            formatter={(value) =>
                              value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/(,*)/g, "")}
                            onChange={(e) => {
                              setInitValue({
                                ...initValueQuantity,
                                cod_amount: e?.target?.value,
                              });
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Tổng giá trị hàng hoá"
                          name="insurance_value"
                        >
                          <Input placeholder="" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  <div className="section-pack-of-data">
                    <div className="header-text">
                      <Title level={5} style={{ color: "#f26522" }}>
                        | Gói cước - cho khối lượng{" "}
                        {`${
                          (initValueQuantity?.heightOrder *
                            initValueQuantity?.lengthOrder *
                            initValueQuantity?.widthOrder) /
                          5
                        }
                  `}
                        (g)
                      </Title>
                    </div>
                    <div className="render-service">
                      {dataService?.length > 0 && (
                        <>
                          <div className="form-group-service">
                            <Form.Item
                              name="radio-button"
                              label="Chọn gói dịch vụ"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn gói dịch vụ!",
                                },
                              ]}
                            >
                              <Radio.Group>
                                {dataService
                                  ?.filter((x) => x?.short_name)
                                  .map((service, index) => (
                                    <Radio
                                      key={index}
                                      value={`${service?.service_id}`}
                                      onChange={(e) =>
                                        handleChangeServiceFee(
                                          e,
                                          service?.short_name
                                        )
                                      }
                                    >
                                      {service?.short_name}
                                    </Radio>
                                  ))}
                              </Radio.Group>
                            </Form.Item>
                          </div>
                          <div className="payment-service-fee">
                            {paymentFeeService > 0 && leadTime && (
                              <>
                                {" "}
                                Phí dịch vụ:
                                <strong>
                                  {" "}
                                  {fomart_current(paymentFeeService)}
                                </strong>{" "}
                                <Typography>
                                  Ngày giao hàng dự kiến:{" "}
                                  <strong>
                                    {" "}
                                    {new Date(
                                      Number(leadTime * 1000)
                                    ).toLocaleDateString("en-GB")}
                                  </strong>
                                </Typography>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="message-code-value">
                      {codeMessageValue && (
                        <>
                          <Typography
                            style={{
                              color: "#f26522",
                              fontSize: "12px",
                              fontStyle: "italic",
                              margin: "12px 0px",
                            }}
                          >
                            <strong>{codeMessageValue}</strong>
                          </Typography>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="section-note" style={{ margin: "12px 0px" }}>
                    <Title level={5} style={{ color: "#f26522" }}>
                      | Lưu ý - ghi chú
                    </Title>
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          label="Lưu ý giao hàng"
                          name="required_note"
                          hasFeedback
                          rules={[
                            {
                              required: true,
                              message: "Trường này là bắt buộc!",
                            },
                          ]}
                        >
                          <Select placeholder="Cho xem hàng không cho thử">
                            <Option value="CHOTHUHANG">
                              Không cho xem hàng
                            </Option>
                            <Option value="CHOXEMHANGKHONGTHU">
                              Cho xem hàng không cho thử
                            </Option>
                            <Option value="KHONGCHOXEMHANG">
                              Cho thử hàng
                            </Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="Thêm mã đơn khách hàng"
                          name="client_order_code"
                        >
                          <Input placeholder="" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Ghi chú" name="note">
                          <TextArea
                            rows={4}
                            placeholder="Ví dụ: Lấy sản phẩm 1 2 cái, lấy sản phẩm 2 1 cái"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col
                  span={4}
                  className="create-form-right"
                  style={{ boxShadow: "0 4px 10px rgb(0 0 0 / 20%)" }}
                >
                  <div className="section-promotion"></div>
                  <div className="section-calculator">
                    <div className="name-package-promotion">
                      <div>
                        <Typography
                          style={{
                            marginBottom: "12px",
                            fontSize: "16px",
                            color: "#cf1818",
                          }}
                        >
                          {paymentFeeService > 0 && serviceNameFee && (
                            <>
                              Gói {serviceNameFee}:{" "}
                              {fomart_current(paymentFeeService)}
                            </>
                          )}
                        </Typography>
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          paddingBottom: "12px",
                        }}
                      >
                        <Form.Item label="Mã KM">
                          <Input placeholder="" />
                        </Form.Item>
                        <Typography
                          style={{ fontSize: "12px", fontStyle: "italic" }}
                        >
                          Mỗi gói hàng chỉ được áp dụng 1 mã giảm giá.
                        </Typography>
                      </div>
                    </div>
                    <div
                      className="section-select-payment-submit-order"
                      style={{ position: "fixed", bottom: "0px" }}
                    >
                      <div>
                        <Typography style={{ margin: "8px 0px" }}>
                          <strong>Tùy chọn thanh toán</strong>
                        </Typography>
                        <Form.Item
                          label=""
                          name="payment_type_id"
                          hasFeedback
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "Trường này là bắt buộc!",
                          //   },
                          // ]}
                        >
                          <Select
                            placeholder="Vui lòng chọn bên trả phí"
                            onChange={handleChangePaymentTypeId}
                            defaultValue="1"
                          >
                            <Option value="1">Bên gửi trả phí</Option>
                            <Option value="2">Bên nhận trả phí</Option>
                          </Select>
                        </Form.Item>
                      </div>
                      <div>
                        <Typography>
                          Tổng phí:{" "}
                          <span style={{ fontSize: "18px", color: "#00467f" }}>
                            {" "}
                            {paymentFeeService > 0 && (
                              <> {fomart_current(paymentFeeService)}</>
                            )}
                          </span>{" "}
                        </Typography>
                        <Typography
                          style={{
                            color: "#f26522",
                            fontSize: "12px",
                            margin: "8px 0px",
                          }}
                        >
                          {statusPaymentTypeId && (
                            <>{`${statusPaymentTypeId} - Chưa tính tiền thu hộ`}</>
                          )}
                        </Typography>
                      </div>
                      <div className="form-submit">
                        <Form.Item
                        // wrapperCol={{
                        //   offset: 8,
                        //   span: 16,
                        // }}
                        // style={{ display: "flex" }}
                        >
                          <div style={{ display: "flex", margin: "24px" }}>
                            <div>
                              <Button
                                type="default"
                                htmlType="reset"
                                disabled={isLoading}
                              >
                                Xóa đơn
                              </Button>
                            </div>
                            <div>
                              {isLoading && (
                                <>
                                  <Spin indicator={antIcon} />
                                </>
                              )}
                              <Button
                                type="primary"
                                htmlType="submit"
                                style={{ marginLeft: "12px" }}
                                disabled={isLoading}
                              >
                                Tạo đơn
                              </Button>
                            </div>
                          </div>
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </>
      )}
    </>
  );
}

export default CreateOrderDelivery;
