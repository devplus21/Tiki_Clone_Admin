import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Sale_API from '../../api/sale';
import { STATUS_OK } from '../../constants/api';
import SaleRecord from './SaleRecord';
import './style.scss';

const SalePage = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sales, setSales] = useState([]);

  const onSubmit = async (values) => {
    if (!selectedItem) {
      try {
        values.date = values.date.toISOString();
        const response = await Sale_API.createSale(values);
        if (response.status === STATUS_OK) {
          notification.success({
            message: 'Success',
            description: 'Tạo khuyến mãi thành công',
            duration: 2,
          });

          setCreateModalVisible(false);
          setSales((prev) => [...prev, response.data]);
        } else {
          notification.warn({
            message: 'Warn',
            description: response.message,
            duration: 2,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        values.date = values.date.toISOString();
        const response = await Sale_API.updateSale(selectedItem._id, values);
        if (response.status === STATUS_OK) {
          notification.success({
            message: 'Success',
            description: 'Cập nhật khuyến mãi thành công',
            duration: 2,
          });

          setCreateModalVisible(false);
          setSales((prev) => {
            const index = prev.findIndex(
              (item) => item._id === selectedItem._id
            );
            const newData = [...prev];
            newData[index] = response.data;

            return newData;
          });
        } else {
          notification.warn({
            message: 'Warn',
            description: response.message,
            duration: 2,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleModal = (status) => {
    setCreateModalVisible(status);
  };

  const querySales = async () => {
    try {
      const response = await Sale_API.querySales('');
      if (response.status === STATUS_OK) {
        return response.data;
      } else {
        notification.warn({
          message: 'Warn',
          description: response.message,
          duration: 2,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (saleId) => {
    try {
      const response = await Sale_API.removeSale(saleId);
      if (response.status === STATUS_OK) {
        setSales((prev) => prev.filter((item) => item._id !== saleId));
      } else {
        notification.warn({
          message: 'Warn',
          description: response.message,
          duration: 2,
        });
      }
    } catch (error) {
      notification.warn({
        message: 'Warn',
        description: error.message,
        duration: 2,
      });
    }
  };

  useEffect(async () => {
    const saleList = await querySales();
    setSales(saleList || []);
  }, []);

  useEffect(() => {
    if (selectedItem) setCreateModalVisible(true);
  }, [selectedItem]);

  const initialValues = selectedItem && {
    title: selectedItem.title,
    date: moment(selectedItem.date),
    description: selectedItem.description,
    value: selectedItem.value,
  };

  return (
    <div id="sale__page">
      <Modal
        footer={null}
        visible={createModalVisible}
        title={selectedItem ? 'Cập nhật' : 'Thêm khuyến mãi'}
        onCancel={() => toggleModal(false)}
        destroyOnClose
      >
        <Form
          onFinish={onSubmit}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          initialValues={initialValues || undefined}
        >
          <Form.Item rules={[{ required: true }]} name="title" label="Tên">
            <Input />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} name="date" label="Thời hạn">
            <DatePicker disabledDate={(date) => date.valueOf() < Date.now()} />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} name="value" label="Giảm giá">
            <InputNumber min={1} max={100} prefix="%" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            name="description"
            label="Mô tả"
          >
            <Input.TextArea />
          </Form.Item>
          <Button htmlType="submit" block type="primary">
            {selectedItem ? 'Cập nhật' : 'Tạo'}
          </Button>
        </Form>
      </Modal>
      <div className="sales__page-body">
        <div className="body-filter__section">
          <div className="sale__actions">
            <div
              className="create__sale-button"
              onClick={() => toggleModal(true)}
            >
              <Button type="primary">
                Thêm Khuyến mãi <PlusOutlined />
              </Button>
            </div>
            <div className="sale__actions-search">
              <Input.Group compact>
                <Input
                  style={{ width: 240 }}
                  placeholder="Nhập tên khuyến mãi..."
                  onChange={() => { }}
                />
                <Button type="primary">Tìm kiếm</Button>
              </Input.Group>
            </div>
          </div>
        </div>
        <div className="body-wrapper">
          <ul className="sale-records__list">
            <li className="sale-record__wrapper title__record">
              <Row>
                <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                  <div className="title__record-info__section">
                    <Row>
                      <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                        <div className="info__key">Tiêu đề</div>
                      </Col>
                      <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                        <div className="info__key">Thời hạn</div>
                      </Col>
                      <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                        <div className="info__key">Trị giá</div>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xl={4} lg={4} sm={4} md={4} xs={4}></Col>
                <Col xl={4} lg={4} md={4} sm={24} xs={24}>
                  <div className="title__record-action__section">
                    <Row>
                      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <span className="action__key">Sửa</span>
                      </Col>
                      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <span className="action__key">Xóa</span>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </li>
            {sales.map((item) => (
              <li className="sale-record__wrapper value__record" key={item._id}>
                <SaleRecord
                  data={item}
                  onClick={() => setSelectedItem(item)}
                  onDelete={handleDelete}
                // onUpdateStatus={() => {}}
                />
              </li>
            ))}
          </ul>
        </div>
        {/* {pagination.total > pagination.size && (
          <div className="pagination__container">
            <Pagination
              defaultCurrent={pagination.current}
              total={pagination.total}
              pageSize={pagination.size}
              onChange={handlePageChange}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SalePage;
