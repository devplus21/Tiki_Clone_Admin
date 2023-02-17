import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Col, Modal, Row, Switch, Badge, notification } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PRODUCT_API from '../../../../api/product';
import { STATUS_OK } from '../../../../constants/api';
import { formatNumber, getSalePrice } from '../../../../utils';
import './style.scss';

const ProductRecord = ({ data, onDelete }) => {
  const [productStatus, setProductStatus] = useState(data.status);

  async function updateProductStatus(checked) {
    try {
      const response = await PRODUCT_API.updateProduct(data._id, {
        status: checked,
      });
      if (response.status === STATUS_OK);
      setProductStatus(checked);
      notification.success({
        placement: 'topRight',
        message: 'Success',
        description: 'Cập nhật thành công',
        duration: 3,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="product__record">
      <Row>
        <Col xl={20} lg={20} md={20} sm={24} xs={24}>
          <div className="title__record-info__section">
            <Row>
              <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                <Link
                  to={`/products/${data.slug}`}
                  className="info-value thumbnail"
                >
                  <img src={data.thumbnail_url} alt={data.name} />
                </Link>
              </Col>
              <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                <Link
                  to={`/products/${data.slug}`}
                  className="info-value title"
                >
                  {data.name}
                </Link>
              </Col>
              <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                {data.stock < 5 ? (
                  <Badge
                    count={data.stock}
                    size="large"
                    showZero
                    overflowCount={1000000}
                    style={{ backgroundColor: data.stock > 5 && '#52c41a' }}
                  />
                ) : (
                  <span className="stock">{data.stock}</span>
                )}
              </Col>
              <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                {data.sold > 50 ? (
                  <Badge
                    count={data.sold}
                    overflowCount={1000000}
                    showZero
                    style={{
                      backgroundColor: '#52c41a',
                    }}
                  />
                ) : (
                  <span className="sold">{data.sold || 0}</span>
                )}
              </Col>
              <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                <span className="info-value price">
                  {formatNumber(getSalePrice(data.price, data.sale_percent))}đ
                </span>
              </Col>
              <Col xl={2} lg={2} sm={2} md={2} xs={2}>
                <div className="info-value">
                  <Switch
                    checked={productStatus}
                    onChange={updateProductStatus}
                    size="small"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col xl={4} lg={4} md={4} sm={24} xs={24}>
          <div className="title__record-action__section">
            <Row>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <Link to={`/products/${data.slug}`} className="actions-value">
                  <EditFilled style={{ color: '#1890ff' }} />
                </Link>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <div
                  onClick={() => onDelete(data._id)}
                  className="actions-value"
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

export default ProductRecord;
