import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Col, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const SaleRecord = ({ data, onClick, onDelete, onUpdateStatus }) => {
  const onStatusChange = (value) => {
    // onUpdateStatus(data._id, value);
  };

  return (
    <div className="sale__record">
      <Row>
        <Col xl={16} lg={16} md={16} sm={24} xs={24}>
          <div className="title__record-info__section">
            <Row>
              <Col xl={8} lg={8} sm={8} md={8} xs={8}>
                <Link className="info-value title">{data.title}</Link>
              </Col>
              <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                <Link className="info-value title">
                  {moment(data.date).format('DD/MM/YYYY')}
                </Link>
              </Col>
              <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                <div className="info-value">{data.value}%</div>
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
                  <EditFilled style={{ color: '#1890ff' }} />
                </div>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <div
                  className="actions-value"
                  onClick={() => onDelete(data._id)}
                >
                  <DeleteFilled style={{ color: 'var(--my-red)' }} />
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SaleRecord;
