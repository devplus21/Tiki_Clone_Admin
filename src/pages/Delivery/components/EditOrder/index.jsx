import { EditFilled } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  notification,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import axios from "axios";
import { default as React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditOwner from "../EditOwner";
import "./style.scss";

EditOrder.propTypes = {};

function getStatusOrderLog(log) {
  switch (log) {
    case "insert":
      return "Tạo đơn";
    case "update":
      return "Cập nhật đơn";

    default:
      return "Chưa biết tình trạng";
  }
}

function getDateTime(dateTime) {
  const newDateTime = new Date(dateTime);
  const date = newDateTime.toLocaleDateString("en-GB");
  const house = newDateTime.getHours();
  const minutes = `0${newDateTime.getMinutes()}`.slice(-2);

  return ` ${house}:${minutes} - ${date}`;
}

function fomart_current(cost) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(cost);
}

function EditOrder(props) {
  const param = useParams();
  const order_code = param?.shopid;

  const [dataDetail, setDataDetail] = useState(undefined);

  const { Title } = Typography;
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { Option } = Select;

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

  // Get data detail order by shop id
  const detailUrl =
    "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail";

  // const headers = {
  //   "Content-Type": "application/json",
  //   Token: "037a1831-cbba-11ec-ac64-422c37c6de1b",
  //   shop_id: "3581868",
  //   shopid: "3581868",
  //   ShopId: "3581868",
  // };

  useEffect(() => {
    (async () => {
      const response = await axios.post(
        detailUrl,
        {
          order_code,
          source: "5sao",
        },
        { headers }
      );

      const {
        data: { data },
      } = response;
      console.log("data detail", data);
      setDataDetail(data);
    })();
  }, [order_code]);

  const data = {
    payment_type_id: 2,
    note: "", // no
    required_note: "KHONGCHOXEMHANG",
    return_phone: "0332190158", // no
    return_address: "39 NTT", // no
    return_district_id: null, // no
    return_ward_code: null, // no
    client_order_code: "",
    to_name: "",
    to_phone: "",
    to_address: "",
    to_ward_code: "20308",
    to_district_id: 1444,
    cod_amount: 20000, // no
    content: "", // no
    weight: 200,
    length: 1,
    width: 19,
    height: 10,
    pick_station_id: 1444,
    deliver_station_id: null,
    insurance_value: 10000000,
    service_id: 0,
    // service_type_id: 2,
    service_type_id: null,
    coupon: null,
    pick_shift: [2],
    items: [],
  };

  const toDistrictId = dataDetail?.to_district_id || 0;
  const toWardCode = dataDetail?.to_ward_code || "";

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
      try {
        const response = await axios.post(
          "https://fe-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id",
          { district_id: Number(districtID) || Number(toDistrictId) },
          {
            headers,
          }
        );
        const {
          data: { data },
        } = response;
        setWardList(data);
      } catch (error) {
        console.log("Failed to fetch ward list", error);
      }
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
    "weight",
    "quantity",
    "quantity_gam",
    "length",
    "height",
    "width",
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

  const restDataDetail = dataDetail?.items[0];
  let initAddressArr = "";

  if (dataDetail?.to_address?.length > 1) {
    initAddressArr = dataDetail?.to_address?.split(", ");
  }

  const initValue = {
    quantity_gam: 1,
    quantity: 1,
    lengthOrder: 0,
    widthOrder: 0,
    heightOrder: 0,
    weight: 0,
  };

  const [initValueQuantity, setInitValue] = useState(() => initValue);

  form.setFieldsValue({
    weight: formNewCommon?.quantity * formNewCommon?.quantity_gam,
  });

  form.setFieldsValue({
    insurance_value: formNewCommon?.cod_amount,
  });

  const newAddressFormat = `${formNewCommon?.to_address}, ${formNewCommon?.to_ward_code}, ${formNewCommon?.to_district_id}, ${formNewCommon?.province}`;

  // Call api get service
  const [dataService, setDataService] = useState([]);
  const [codeMessageValue, setCodeMessageValue] = useState("");
  const urlService =
    "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";

  const urlFeeService =
    "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";

  const [paymentFeeService, setPaymentFeeService] = useState(0);
  const [serviceId, setServiceId] = useState(() =>
    Number(dataDetail?.service_id)
  );

  useEffect(() => {
    (async () => {
      try {
        const responseService = await axios.post(
          urlService,
          {
            shop_id: 3581868,
            from_district: 1451,
            to_district: Number(districtID) || toDistrictId,
          },
          {
            headers,
          }
        );
        const {
          data: { code_message_value, data },
        } = responseService;

        console.log("responseService", responseService);

        setDataService(data);
        setCodeMessageValue(code_message_value);

        const responseFeeService = await axios.post(
          urlFeeService,
          {
            from_district_id: 1451,
            service_id: Number(serviceId) || Number(dataDetail.service_id),
            service_type_id: null,
            to_district_id:
              Number(districtID) || Number(dataDetail.to_district_id),
            to_ward_code: WardCode || String(toWardCode),
            height:
              Number(initValueQuantity?.heightOrder) ||
              Number(dataDetail.height),
            length:
              Number(initValueQuantity?.lengthOrder) ||
              Number(dataDetail.length),
            weight:
              Number(initValueQuantity?.weight) || Number(dataDetail.weight),
            width: Number(initValueQuantity.width) || Number(dataDetail.width),
            insurance_value: Number(dataDetail.insurance_value) || 0,
            coupon: null,
          },
          {
            headers,
          }
        );

        console.log("responseFeeService---", responseFeeService?.data?.data);
        const { total } = responseFeeService?.data?.data;
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
    toDistrictId,
    dataDetail,
  ]);

  // Handle fee service
  const [serviceNameFee, setServiceNameFee] = useState(undefined);
  const handleChangeServiceFee = (event, service_name) => {
    const service_id = event.target.value;
    setServiceNameFee(service_name);
    setServiceId(service_id);
  };

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
            to_district_id: Number(districtID) || toDistrictId,
            to_ward_code: String(toWardCode) || String(WardCode),
            service_id: Number(serviceId) || dataDetail.service_id,
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
  }, [districtID, WardCode, serviceId, toDistrictId, toWardCode]);

  // console.log("leadTime===", leadTime);

  // Call API order log
  const urlOrderLog =
    "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/order-logs";
  const [dataOrderLog, setDataOrderLog] = useState(undefined);

  useEffect(() => {
    (async () => {
      try {
        const responveOrderLog = await axios.post(
          urlOrderLog,
          {
            order_code: String(order_code),
            // order_code: "ZYKWK",
            source: "5sao",
          },
          { headers }
        );
        const {
          data: { data },
        } = responveOrderLog;
        console.log("responveOrderLog", data);
        setDataOrderLog(data);
      } catch (error) {
        console.log("Failed to fecth data order log", error);
      }
    })();
  }, [order_code]);

  // Handle change value payment type id
  let defaultPaymentTypeId = 1;

  if (dataDetail?.payment_type_id) {
    defaultPaymentTypeId = dataDetail?.payment_type_id;
  }

  const [statusPaymentTypeId, setStatusPaymentTypeId] = useState(() =>
    Number(defaultPaymentTypeId) === 1 ? "Bên gửi trả phí" : "Bên nhận trả phí"
  );

  const handleChangePaymentTypeId = (value) => {
    if (value === "1") setStatusPaymentTypeId("Bên gửi trả phí");
    if (value === "2") setStatusPaymentTypeId("Bên nhận trả phí");
    return;
  };

  // Handle submit form

  const handleOnFinishForm = async (values) => {
    console.log("values submit: ", values);
    const newValue = {
      ...data,
      ...values,
      order_code,
      to_ward_code: WardCode ?? dataDetail?.to_ward_code,
      to_district_id: districtID ?? dataDetail?.to_district_id,
      to_address: newAddressFormat,
      cod_amount: Number(values?.cod_amount),
      weight: Number(values?.weight),
      length: Number(values?.length),
      width: Number(values?.width),
      height: Number(values?.height),
      payment_type_id: Number(values?.payment_type_id),
      service_id: Number(serviceId) || Number(dataDetail?.service_id),
      insurance_value:
        Number(values?.insurance_value) > 5_000_000
          ? 5_000_000
          : Number(values?.insurance_value),
      items: dataItem,
    };
    delete newValue.quantity;
    delete newValue.quantity_gam;

    console.log("new ValueSumit---", newValue);

    try {
      await axios.post(
        "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/update",
        newValue,
        { headers }
      );
      notification.success({
        placement: "topRight",
        message: "Thành công!",
        description: "Cập nhật đơn hàng thành công!",
        duration: 3,
      });
    } catch (error) {
      notification.error({
        placement: "topRight",
        message: error?.message || "Lỗi",
        description: "Cập nhật đơn hàng bị lỗi!",
        duration: 3,
      });
    }
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
      <div style={{ paddingTop: 20, paddingLeft: 20 }}>
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
      {dataDetail && (
        <>
          <Form
            name="basic"
            form={form}
            initialValues={{
              ...initValueQuantity,
              ...dataDetail,
              name: restDataDetail?.name,
              code: restDataDetail?.code,
              quantity: restDataDetail?.quantity,
              weight: restDataDetail?.weight,
              quantity_gam:
                Number(restDataDetail?.weight) /
                Number(restDataDetail?.quantity),
              province: initAddressArr[3] || "",
              to_district_id: initAddressArr[2] || "",
              to_ward_code: initAddressArr[1] || "",
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
                  <div className="section-send_order"></div>
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
                            <Input onChange={handleChange} name="to_phone" />
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
                            <Input onChange={handleChange} name="to_name" />
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
                            <Input onChange={handleChange} name="to_address" />
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
                        <Form.Item label="" name="name">
                          <Input placeholder="Nhập tên sản phẩm" />
                        </Form.Item>
                        <Form.Item label="" name="code">
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
                            name="quantity_gam"
                          />
                        </Form.Item>
                        <Form.Item label="SL" name="quantity">
                          <Input
                            placeholder=""
                            onChange={(e) => {
                              setInitValue({
                                ...initValueQuantity,
                                quantity: e.target.value,
                              });
                            }}
                            name="quantity"
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
                          <Input
                            placeholder=""
                            //   name="weight"
                            disabled
                          />
                        </Form.Item>
                        <Form.Item label="Dài" name="length">
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
                        <Form.Item label="Rộng" name="width">
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
                        <Form.Item label="Cao" name="height">
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
                        {formNewCommon.length *
                          formNewCommon.height *
                          formNewCommon.width !==
                        dataDetail?.converted_weight ? (
                          <>
                            {" "}
                            {(formNewCommon.length *
                              formNewCommon.height *
                              formNewCommon.width) /
                              5}
                          </>
                        ) : (
                          <>{dataDetail?.converted_weight}</>
                        )}
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
                        >
                          <Input
                            placeholder=""
                            onChange={(e) => {
                              setInitValue({
                                ...initValueQuantity,
                                cod_amount: e.target.value,
                              });
                              form.setFieldsValue({
                                insurance_value: formNewCommon?.cod_amount,
                              });
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Tổng giá trị hàng hoá"
                          name="insurance_value"
                        >
                          <Input placeholder="" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  <div className="section-pack-of-data">
                    <div className="header-text">
                      <Title level={5} style={{ color: "#f26522" }}>
                        | Gói cước - cho khối lượng {}
                        {formNewCommon.length *
                          formNewCommon.height *
                          formNewCommon.width !==
                        dataDetail?.converted_weight ? (
                          <>
                            {" "}
                            {(formNewCommon.length *
                              formNewCommon.height *
                              formNewCommon.width) /
                              5}
                          </>
                        ) : (
                          <>{dataDetail?.converted_weight}</>
                        )}
                        (g)
                      </Title>
                    </div>
                    <div className="render-service">
                      {dataService?.length > 0 && (
                        <>
                          <div className="render-service">
                            <Form.Item
                              name="radio-button"
                              label="Chọn gói dịch vụ"
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: "Vui lòng chọn gói dịch vụ!",
                              //   },
                              // ]}
                            >
                              <Radio.Group
                                name="service_id"
                                defaultValue={String(dataDetail?.service_id)}
                              >
                                {dataService
                                  ?.filter((x) => x?.short_name)
                                  .map((service, index) => (
                                    <Radio
                                      key={index}
                                      value={`${service?.service_id}`}
                                      onChange={(event) =>
                                        handleChangeServiceFee(
                                          event,
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
                          <strong>{codeMessageValue}</strong>
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
                          <Input placeholder="" disabled />
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
                      className="history-order-log"
                      style={{
                        margin: "12px 0px",
                        borderBottom: "1px solid #ccc",
                        paddingBottom: "8px",
                      }}
                    >
                      <Typography style={{ color: "#f26522" }}>
                        Lịch sử đơn hàng
                      </Typography>
                      {dataOrderLog?.length > 0 && (
                        <>
                          {dataOrderLog.map((log, index) => (
                            <Typography
                              key={log._id}
                              style={{ fontSize: "13px", margin: "4px 0px" }}
                            >
                              {getDateTime(log.createdAt)}{" "}
                              {getStatusOrderLog(log.action)}
                              {" bởi"}
                              <span style={{ color: "#f26522" }}>
                                {" "}
                                {log.client_name}
                              </span>{" "}
                            </Typography>
                          ))}
                        </>
                      )}
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
                          rules={[
                            {
                              required: true,
                              message: "Trường này là bắt buộc!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Vui lòng chọn bên trả phí"
                            onChange={handleChangePaymentTypeId}
                            defaultValue={dataDetail?.payment_type_id}
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
                              <Button type="default" htmlType="reset">
                                Xóa đơn
                              </Button>
                            </div>
                            <div>
                              <Button
                                type="primary"
                                htmlType="submit"
                                style={{ marginLeft: "12px" }}
                              >
                                Cập nhật đơn
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

export default EditOrder;
