import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Col, Modal, Row } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const StaffRecord = ({ data, onClick, onDelete }) => {
  return (
    <div className="staff__record">
      <Row>
        <Col xl={8} lg={8} md={8} sm={24} xs={24}>
          <div className="title__record-info__section">
            <Row>
              <Col xl={16} lg={16} sm={16} md={16} xs={16}>
                <Link className="info-value title">{`${data.last_name} ${data.first_name}`}</Link>
              </Col>
              <Col xl={8} lg={8} sm={8} md={8} xs={8}>
                <div className="info-value">
                  <span>{moment(data.createdAt).format("YYYY-MM-DD")}</span>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col xl={12} lg={12} sm={12} md={12} xs={12}></Col>
        <Col xl={4} lg={4} md={4} sm={24} xs={24}>
          <div className="title__record-action__section">
            <Row>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <span onClick={() => onClick(data)} className="actions-value">
                  <EditFilled style={{ color: "#1890ff" }} />
                </span>
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

export default StaffRecord;
