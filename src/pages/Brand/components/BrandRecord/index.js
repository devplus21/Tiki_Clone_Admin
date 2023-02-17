import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Col, Row, Switch } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const BrandRecord = ({ data, onClick, onDelete, onUpdateStatus }) => {
  const onStatusChange = (value) => {
    onUpdateStatus(data._id, value);
  };

  return (
    <div className="brand__record">
      <Row>
        <Col xl={16} lg={16} md={16} sm={24} xs={24}>
          <div className="title__record-info__section">
            <Row>
              <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                <img
                  src={data.image_url}
                  alt={data.name}
                  className="thumbnail"
                  onClick={onClick}
                />
              </Col>
              <Col xl={8} lg={8} sm={8} md={8} xs={8}>
                <Link className="info-value title">{data.name}</Link>
              </Col>
              <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                <div className="info-value">
                  <Switch
                    defaultChecked={data.status}
                    onChange={onStatusChange}
                    size="small"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col xl={4} lg={4} sm={4} md={4} xs={4}></Col>
        <Col xl={4} lg={4} md={4} sm={24} xs={24}>
          <div className="title__record-action__section">
            <Row>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <div onClick={onClick} className="actions-value">
                  <EditFilled style={{ color: "#1890ff" }} />
                </div>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <div
                  className="actions-value"
                  onClick={() => onDelete(data._id)}
                >
                  <DeleteFilled style={{ color: "var(--my-red)" }} />
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BrandRecord;
