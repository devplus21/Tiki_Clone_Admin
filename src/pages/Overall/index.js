import {
  DollarCircleOutlined,
  ScheduleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Col, DatePicker, Row } from "antd";
import React, { useEffect, useState } from "react";
import COMMON_API from "../../api/common";
import { STATUS_OK } from "../../constants/api";
import { formatNumber } from "../../utils";
import LineChartComponent from "./components/LineChart";
import BarChartComponent from "./components/BarChart";
import StatsViewer from "./components/StatsViewer";
import "./style.scss";
import moment from "moment";

export const formatDateTime = (value) => {
  const fromDate = new Date(new Date(value).setHours(0, 0, 0, 0)).toISOString();
  const toDate = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
}
const OverallPage = () => {
  const now = new Date();
  const format = "DD/MM/YYYY";
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [date, setDate] = useState({
    fromDate: new Date(firstDay).toISOString(),
    toDate: new Date(lastDay).toISOString()
  });
  const [statisticData, setStatisticData] = useState({});

  useEffect(() => {
    (async function () {
      try {
        const response = await COMMON_API.getStatistic(date);
        if (response.status === STATUS_OK) setStatisticData(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [date]);

  console.log('fromDate', moment(new Date(date.fromDate), 'YYYY-MM-DDT23:99:99.999[Z]').format('YYYY-MM-DDT23:99:99.999[Z]'));

  console.log('date===', date);


  const topSoldData = statisticData.topSold?.map((item) => {
    return {
      name: item.name,
      uv: item.sold,
      amt: item.sold,
    };
  });

  const topBrandData = statisticData.brandStatistic?.map((item) => {
    return {
      name: item._id,
      uv: item.totalSold,
      amt: item.rate,
    };
  });

  const topRate = statisticData.topRate?.map((item) => {
    return {
      name: item.name,
      uv: item.rate,
      amt: item.rate,
    };
  });

  return (
    <div id="overall__page">
      <div style={{ marginBottom: 24, display: 'flex', marginLeft: 16, width: '100%' }}>
        <div >
          <DatePicker
            onChange={value => setDate(pre => ({ ...pre, fromDate: new Date(new Date(value).setHours(0, 0, 0, 0)).toISOString() }))}
            placeholder="Từ ngày"
            style={{ width: 200, cursor: 'pointer' }}
            format={format}
            defaultValue={moment(moment(firstDay).format(format), format)} />
        </div>

        <div style={{ marginLeft: 24 }}>
          <DatePicker
            onChange={value => setDate(pre => ({ ...pre, toDate: new Date(new Date(value).setHours(23, 59, 59, 999)).toISOString() }))}
            placeholder="Đến ngày" style={{ width: 200, cursor: 'pointer' }}
            format={format}
            defaultValue={moment(moment(lastDay).format(format), format)}
          />
        </div>
      </div>
      <div className="stats__viewer-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <StatsViewer
              title={"Đơn hàng"}
              iconEl={
                <ScheduleOutlined style={{ color: "white", fontSize: 20 }} />
              }
              color={"green"}
              description={`Tổng số đơn hàng từ <span class="text-hightlight"> ${moment(date?.fromDate).format(format)} </span> đến <span class="text-hightlight"> ${moment(date?.toDate).format(format)} </span>`}
              value={statisticData.totalOrdersInMonth}
            />
          </Col>
          <Col span={8}>
            <StatsViewer
              title={"Doanh thu"}
              iconEl={
                <DollarCircleOutlined
                  style={{ color: "white", fontSize: 20 }}
                />
              }
              color={"green"}
              description={`Tổng doanh thu từ <span class="text-hightlight"> ${moment(date?.fromDate).format(format)} </span> đến <span class="text-hightlight"> ${moment(date?.toDate).format(format)} </span>`}
              value={formatNumber(statisticData.totalAmountInMonth) + "đ"}
            />
          </Col>
          <Col span={8}>
            <StatsViewer
              title={"Nguời dùng"}
              iconEl={
                <UsergroupAddOutlined
                  style={{ color: "white", fontSize: 20 }}
                />
              }
              color={"green"}
              description={`Tổng số người dùng mới từ <span class="text-hightlight"> ${moment(date?.fromDate).format(format)} </span> đến <span class="text-hightlight"> ${moment(date?.toDate).format(format)} </span>`}

              value={statisticData.totalUsersInMonth}
            />
          </Col>
        </Row>
      </div>
      {topSoldData && (
        <div className="line__chart-wrapper">
          <BarChartComponent data={topSoldData} title={"Sản phẩm bán chạy"} />
        </div>
      )}
      {topRate && (
        <div className="line__chart-wrapper">
          <BarChartComponent data={topRate} title={"Sản phẩm được yêu thích nhiều"} />
        </div>
      )}
      {topBrandData && (
        <div className="line__chart-wrapper">
          <BarChartComponent data={topBrandData} title="Nhãn hàng hot" />
        </div>
      )}
    </div>
  );
};

export default OverallPage;
