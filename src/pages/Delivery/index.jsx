import {
  CarOutlined,
  DeleteOutlined,
  EditFilled,
  EditOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./style.scss";

Delivery.propTypes = {};

function fomart_current(cost) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(cost);
}

function getStatus(status) {
  switch (status) {
    case "ready_to_pick":
      return "Chờ lấy hàng";
    case "cancel":
      return "Hủy đơn hàng";

    default:
      return "Trạng thái chưa biết!";
  }
}

function getDateTime(date) {
  const dateNew = new Date(date);
  return `Ngày tạo: ${dateNew?.getDay() + 1}/${
    dateNew?.getMonth() + 1
  }/${dateNew?.getFullYear()}`;
}

function getAdrress(address) {
  return address.length > 50 ? `${address.slice(0, 50)}...` : address;
}

function getPaymentTypeId(paymentType) {
  if (Number(paymentType) === 1) return "Bên gửi trả phí";
  if (Number(paymentType) === 2) return "Bên nhận trả phí";

  return;
}

function Delivery(props) {
  const { Column } = Table;
  // const [selectionType, setSelectionType] = useState("checkbox");
  const [data, setData] = useState([]);
  const { TabPane } = Tabs;
  const history = useHistory();
  const [dateTime, setDateTime] = useState({});

  // console.log(new Date(Number(1651424400 * 1000)).toLocaleDateString("en-GB"));
  // console.log(new Date(Number(1652720400 * 1000)).toLocaleDateString("en-GB"));

  const staticDataFilter = {
    shop_id: 3581868,
    payment_type_id:
      dateTime?.payment_type_id?.length > 0
        ? dateTime?.payment_type_id
        : [1, 2],
    from_time: dateTime?.from_time ? dateTime?.from_time : 1669827600,
    to_time: dateTime?.to_time ? dateTime?.to_time : 1672506000,
    offset: 0,
    limit: 20,
    option_value: null,
    from_cod_amount: 0,
    to_cod_amount: 0,
    ignore_shop_id: false,
    shop_ids: null,
    is_search_exactly: true,
    is_print: null,
    source: "5sao",
    status:
      dateTime?.status?.length > 0
        ? dateTime?.status
        : ["ready_to_pick", "picking", "money_collect_picking"],
  };

  const filterByStatus = {
    "Chờ bàn giao": {
      status: ["all", "ready_to_pick", "picking", "money_collect_picking"],
      ...staticDataFilter,
    },
    "Hủy đơn hàng": {
      status: ["all", "cancel"],
      ...staticDataFilter,
    },
    "Đã bàn giao - Đang giao": {
      status: [
        "all",
        "picked",
        "sorting",
        "storing",
        "transporting",
        "delivering",
        "delivery_fail",
        "money_collect_delivering",
      ],
      ...staticDataFilter,
    },

    "Đã bàn giao - Đang hoàn hàng": {
      status: [
        "all",
        "return",
        "returning",
        "return_fail",
        "return_transporting",
        "return_sorting",
      ],
      ...staticDataFilter,
    },
    "Chờ xác nhận giao lại": {
      status: ["all", "waiting_to_return"],
      ...staticDataFilter,
    },
    "Hoàn tất": {
      status: ["all", "returned", "delivered"],
      ...staticDataFilter,
    },
    "Hàng thất lạc - hư hỏng": {
      status: ["all", "lost", "damage"],
      ...staticDataFilter,
    },
  };

  // Default get data by status ready_to_pick
  // const searchUrl =
  //   "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/search";
  const searchUrl =
    "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/search";

  const headers = {
    "Content-Type": "application/json",
    // Token: "037a1831-cbba-11ec-ac64-422c37c6de1b",
    // Token: "f47eaf64-d85c-11ec-ac32-0e0f5adc015a",
    Token: "1940c02b-7dbe-11ed-b09a-9a2a48e971b0",

    // shop_id: "3581868",
    // shopid: "3581868",
    shop_id: 3581868,
    shopid: 3581868,
    ShopId: "3581868",
  };

  // useEffect(() => {
  //   (async () => {
  //     const {
  //       data: {
  //         data: { data, soc },
  //       },
  //     } = await axios.post(searchUrl, filterByStatus["Chờ bàn giao"], {
  //       headers,
  //     });
  //     const filterData = data.map((x) => ({
  //       _id: x?._id,
  //       soc_id: x?.soc_id,
  //       order_code: x?.order_code,
  //       from_name: x?.from_name,
  //       status: x?.status,
  //       to_name: x?.to_name,
  //       to_phone: x?.to_phone,
  //       to_address: x?.to_address,
  //       order_date: x?.order_date,
  //       cod_amount: x?.cod_amount,
  //     }));

  //     const filterSoc = soc?.map((x) => ({
  //       _id: x?._id,
  //       value: x?.payment[0].value,
  //     }));

  //     filterData?.forEach((x) => {
  //       filterSoc.forEach((y) => {
  //         if (x?.soc_id === y?._id) {
  //           x.value = y?.value;
  //         }
  //       });
  //     });
  //     const order_detail = filterData?.map((x) => ({
  //       order_code: [x.order_code, getStatus(x?.status), x?.from_name],
  //       to_name: [
  //         x?.to_name,
  //         x?.to_phone,
  //         getDateTime(x?.order_date),
  //         getAdrress(x?.to_address),
  //       ],
  //       to_phone: x?.to_phone,
  //       cod_amount: x?.cod_amount,
  //       order_date: x?.order_date,
  //       total_cost_service: x?.value,
  //       total: `${x?.value + x?.cod_amount}`,
  //     }));
  //     // console.log("order_detail---", order_detail);
  //     setData([...order_detail]);
  //   })();
  // }, []);

  // UseEffect get date count order by status
  // const urlCountOrderByStatus =
  //   "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/count-order-by-status";

  const urlCountOrderByStatus =
    "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/count-order-by-status";

  const resultOrderByStatus = [];
  const [dataCountOrderByStatus, setDataCountOrderByStatus] = useState([]);
  const [stateStatus, setStateStatus] = useState(() => "Chờ bàn giao");

  const transferNameOfStatus = {
    "Chờ bàn giao": "ready_to_pick",
    "Hủy đơn hàng": "cancel",
    "Đã bàn giao - Đang giao": "delivering",
    "Đã bàn giao - Đang hoàn hàng": "return",
    "Chờ xác nhận giao lại": "waiting_to_return",
    "Hoàn tất": "delivered",
    "Hàng thất lạc - hư hỏng": "damage",
  };

  useEffect(() => {
    (async () => {
      const responseCountOrderByStatus = await axios.post(
        urlCountOrderByStatus,
        // { shop_id: 3581868, source: "5sao" },
        {
          shop_id: 3581868,
          source: "5sao",
        },
        { headers }
      );

      const {
        data: { data },
      } = responseCountOrderByStatus;

      for (const keyData in data) {
        for (const keyTranfer in transferNameOfStatus) {
          if (keyData === transferNameOfStatus[keyTranfer]) {
            resultOrderByStatus.unshift({
              [keyTranfer]: data[keyData],
            });
          }
        }
      }
      // console.log("resultOrderByStatus---", resultOrderByStatus);
      setDataCountOrderByStatus(resultOrderByStatus);
      try {
      } catch (error) {
        console.log("Failed to fetch count order by status ", error);
      }
    })();
  }, []);

  const handleDeleteDevivery = async (text) => {
    const order_codes = [text?.order_code[0]] || [];

    // const urlDeleteDevivery =
    //   "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel";
    const urlDeleteDevivery =
      "https://fe-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel";

    try {
      await axios.post(urlDeleteDevivery, { order_codes }, { headers });
      const dataAfterDelete = data?.filter(
        (x) => x?.order_code[0] !== order_codes[0]
      );
      setData(dataAfterDelete);

      let keyCancle = "Hủy đơn hàng";
      let isIncrementCancle = false;
      const dataCountStatusNewDecrement = dataCountOrderByStatus?.map((x) => {
        for (const key in x) {
          if (key === stateStatus && key !== keyCancle) {
            isIncrementCancle = true;
            return { [key]: x[stateStatus] - 1 };
          } else {
            return x;
          }
        }
      });

      let dataCountStatusNew = [];
      if (isIncrementCancle) {
        dataCountStatusNew = dataCountStatusNewDecrement?.map((x) => {
          for (const key in x) {
            if (key === keyCancle) {
              return { [keyCancle]: x[keyCancle] + 1 };
            } else return x;
          }
        });
      }

      // console.log("dataCountStatusNew", dataCountStatusNew);
      setDataCountOrderByStatus(dataCountStatusNew);
      message.success("Xóa thành công!");
    } catch (error) {
      message.error("Xóa thất bại!");
    }
  };

  function confirm(e, test) {
    handleDeleteDevivery(test);
  }

  function cancel(e) {
    return;
  }

  useEffect(() => {
    callback(stateStatus);
  }, [dateTime, stateStatus]);

  console.log("datetime", dateTime);

  // Render table filter by status
  const callback = async (keyFilter) => {
    // console.log("Key filter", keyFilter);
    setStateStatus(keyFilter);
    for (const key in filterByStatus) {
      if (keyFilter === key) {
        try {
          const {
            data: {
              data: { data, soc },
            },
          } = await axios.post(searchUrl, filterByStatus[key], { headers });

          const filterData = data.map((x) => ({
            _id: x?._id,
            soc_id: x?.soc_id,
            order_code: x?.order_code,
            from_name: x?.from_name,
            status: x?.status,
            to_name: x?.to_name,
            to_phone: x?.to_phone,
            to_address: x?.to_address,
            order_date: x?.order_date,
            cod_amount: x?.cod_amount,
            payment_type_id: x?.payment_type_id,
          }));

          const filterSoc = soc?.map((x) => ({
            _id: x?._id,
            value: x?.payment[0].value,
          }));

          filterData?.forEach((x) => {
            filterSoc.forEach((y) => {
              if (x?.soc_id === y?._id) {
                x.value = y?.value;
              }
            });
          });

          const order_detail = filterData?.map((x) => ({
            order_code: [x.order_code, getStatus(x?.status), x?.from_name],
            to_name: [
              x?.to_name,
              x?.to_phone,
              getDateTime(x?.order_date),
              getAdrress(x?.to_address),
            ],
            to_phone: x?.to_phone,
            cod_amount: x?.cod_amount,
            order_date: x?.order_date,
            total_cost_service: x?.value,
            total: [
              getPaymentTypeId(x?.payment_type_id),
              `Tổng phí: ${
                Number(x?.payment_type_id) === 2
                  ? fomart_current(x?.value + x?.cod_amount)
                  : fomart_current(x?.value)
              }`,
            ],
          }));
          setData([...order_detail]);
        } catch (error) {
          console.log("Failed to fetch data search by status", error);
        }
      }
    }
  };

  const handleClickEditOrder = (e, text) => {
    const order_codes = text?.order_code[0];
    history.push(`/delivery/edit-order/${order_codes}`);
  };

  const handleClickDeliveryOrder = (e, text) => {
    const order_codes = text?.order_code[0];
    history.push(`/tracking-order/${order_codes}`);
  };

  return (
    <div className="pages_delivery">
      <div
        className="btn-order-create"
        style={{ margin: "12px 36px", textAlign: "end" }}
      >
        {/* <Button
          onClick={() => history.push("/delivery/create-order")}
          htmlType="button"
          style={{
            borderRadius: "24px",
            backgroundColor: "#f26522",
            height: "46px",
            color: "white",
          }}
        >
          <EditFilled style={{ fontSize: "16px" }} /> Tạo đơn hàng vận chuyển
          mới
        </Button> */}
      </div>
      <div className="section_tab-delivery" style={{ padding: "16px" }}>
        <Tabs onChange={callback}>
          {dataCountOrderByStatus?.map((x, i) => (
            <TabPane
              tab={`${Object.keys(x)} ${Object.values(x)}`}
              key={`${Object.keys(x)}`}
            ></TabPane>
          ))}
        </Tabs>
      </div>
      <div
        className="section_filter-delivert"
        style={{
          display: "flex",
          marginBottom: 16,
          // justifyContent: "space-between",
        }}
      >
        <p style={{ marginLeft: 16, width: 48 }}>Bộ lọc</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <div>
            <div>Trạng thái</div>
            <div>
              <Select
                options={[
                  {
                    value: "ready_to_pick",
                    label: "Chờ lấy hàng",
                  },
                  {
                    value: "picking",
                    label: "Đang lấy hàng",
                  },
                  {
                    value: "money_collect_picking",
                    label: "Đang tương tác với người gửi",
                  },
                ]}
                style={{ width: "200px" }}
                defaultValue="Tất cả"
                placeholder="Chọn trạng thái"
                onChange={(value) =>
                  setDateTime((pre) => ({ ...pre, status: [value] }))
                }
                allowClear
              />
            </div>
          </div>

          <div>
            <div>Tùy chọn thanh toán</div>
            <div>
              <Select
                options={[
                  {
                    value: 0,
                    label: "Tất cả",
                  },
                  {
                    value: 1,
                    label: "Bên gửi trả phí",
                  },
                  {
                    value: 2,
                    label: "Bên nhận trả phí",
                  },
                ]}
                style={{ width: "200px" }}
                placeholder="Chọn kiểu thanh toán"
                defaultValue={0}
                onChange={(value) =>
                  setDateTime((pre) => {
                    if (value === 0)
                      return {
                        ...pre,
                        payment_type_id: [1, 2],
                      };
                    if (value === 1) {
                      return {
                        ...pre,
                        payment_type_id: [1],
                      };
                    }
                    if (value === 2) {
                      return {
                        ...pre,
                        payment_type_id: [2],
                      };
                    }
                  })
                }
                allowClear
              />
            </div>
          </div>

          <div>
            <div>Thời gian tạo đơn</div>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <div className="from_date">
                <DatePicker
                  onChange={(value) => {
                    const formatDate = moment(value)
                      .format("DD/MM/YYYY")
                      .split("/");

                    const from_time =
                      new Date(
                        formatDate[2],
                        formatDate[1] - 1,
                        formatDate[0]
                      ).getTime() / 1000;

                    setDateTime((pre) => ({ ...pre, from_time }));
                  }}
                  style={{ width: "200px" }}
                  placeholder="Từ ngày"
                />
              </div>
              <div className="to_date" style={{ marginLeft: 24 }}>
                <DatePicker
                  onChange={(value) => {
                    const formatDate = moment(value)
                      .format("DD/MM/YYYY")
                      .split("/");

                    const to_time_now = new Date(
                      formatDate[2],
                      formatDate[1] - 1,
                      formatDate[0]
                    ).getTime();
                    const to_time = (to_time_now + 86400000) / 1000;
                    setDateTime((pre) => ({ ...pre, to_time }));
                  }}
                  style={{ width: "200px" }}
                  placeholder="Đến ngày"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Table
        dataSource={data}
        // rowSelection={{
        //   type: selectionType,
        //   ...rowSelection,
        // }}
      >
        <Column
          title="Mã đơn"
          dataIndex="order_code"
          key="order_code"
          render={(x, y, order_code) => (
            <>
              {" "}
              {y?.order_code.map((e, i) => (
                <div className="order-code" key={i}>
                  <p>{e}</p>
                </div>
              ))}{" "}
            </>
          )}
        />
        <Column
          title="Bên nhận"
          dataIndex="to_name"
          key="to_name"
          render={(x, y, to_name) => (
            <>
              {" "}
              {y?.to_name.map((e, i) => (
                <div key={i}>{e}</div>
              ))}{" "}
            </>
          )}
        />
        <Column
          title="Tổng phí dịch vụ"
          dataIndex="total_cost_service"
          key="total_cost_service"
          render={(total_cost_service) => (
            <>{fomart_current(total_cost_service)}</>
          )}
        />
        <Column
          title="Thu hộ/COD (nếu có)"
          dataIndex="cod_amount"
          key="cod_amount"
          render={(cod_amount) => <>{fomart_current(cod_amount)} </>}
        />
        <Column
          title="Tùy chọn thanh toán"
          dataIndex="total"
          key="total"
          render={(x, y, total) => (
            <>
              {" "}
              {y?.total?.map((e, i) => (
                <div className="select-payment" key={i}>
                  <p>{e}</p>
                </div>
              ))}{" "}
            </>
          )}
        />
        <>
          <Column
            title="Hành động"
            key="action"
            render={(text, record) => (
              <>
                {stateStatus !== "Hủy đơn hàng" && (
                  <Popconfirm
                    title="Hủy đơn hàng?"
                    onConfirm={(e) => confirm(e, text)}
                    onCancel={cancel}
                    okText="Hủy"
                    cancelText="Không"
                  >
                    <Space size="middle">
                      <Tooltip title="Hủy đơn hàng">
                        <DeleteOutlined
                          style={{
                            color: "red",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                        />
                      </Tooltip>
                    </Space>
                  </Popconfirm>
                )}

                <Space size="middle">
                  <Tooltip title="Chỉnh sửa">
                    <EditOutlined
                      onClick={(e) => handleClickEditOrder(e, text)}
                      style={{
                        color: "green",
                        fontSize: "20px",
                        cursor: "pointer",
                        marginLeft: "12px",
                      }}
                    />
                  </Tooltip>
                </Space>

                <Space size="middle">
                  <Tooltip title="Tra cứu">
                    <CarOutlined
                      onClick={(e) => handleClickDeliveryOrder(e, text)}
                      style={{
                        color: "green",
                        fontSize: "20px",
                        cursor: "pointer",
                        marginLeft: "12px",
                      }}
                    />
                  </Tooltip>
                </Space>
              </>
            )}
          />
        </>
      </Table>
    </div>
  );
}

export default Delivery;
