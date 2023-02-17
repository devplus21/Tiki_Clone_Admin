import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, notification, Pagination, Row, Modal } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import BRAND_API from '../../api/brand';
import { STATUS_FAIL } from '../../constants/api';
import BrandModal from './components/BrandForm';
import BrandRecord from './components/BrandRecord';
import './style.scss';

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const BrandPage = () => {
  const queryStrings = window.location.search;
  const query = useQuery();
  const history = useHistory();
  const defaultSearch = query.get('search');
  const defaultPage = query.get('page');

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchValue, setSearchValue] = useState(defaultSearch || 'null');
  const [page, setPage] = useState(defaultPage);

  console.log(page, queryStrings);

  const debouceSearch = useCallback(
    debounce((nextValue) => setSearchValue(nextValue), 1000),
    []
  );

  const handleSearchChange = ({ target: { value } }) => {
    debouceSearch(value);
  };

  const handlePageChange = (value) => {
    setPage(value);
  };

  const updateQuery = () => {
    let url = '/brands?';
    if (searchValue && searchValue !== 'null') url += `search=${searchValue}&`;
    if (page) url += `page=${page}&`;

    history.push(url);
  };

  const handleBrandClick = (item) => {
    setDetailModalVisible(true);
    setSelectedBrand(item);
  };

  const handleBrandUpdate = (newData) => {
    const index = brands.findIndex((item) => item._id === newData._id);
    const currentBrands = [...brands];

    if (index > -1) {
      currentBrands[index] = newData;
    } else {
      currentBrands.push(newData);
    }

    setBrands(currentBrands);
    switchDetailModal(false);
  };

  const handleRemoveBrand = async (_id) => {
    Modal.confirm({
      title: 'Bạn có muốn xóa thương hiệu này?',
      icon: <ExclamationCircleOutlined />,
      content:
        'Thương hiệu đã xóa và các thông tin liên quan sẽ không thể khôi phục lại',
      onOk: async () => {
        const response = await BRAND_API.removeBrands(_id);
        if (response.status === STATUS_FAIL)
          return notification.error({
            placement: 'topRight',
            message: 'Lỗi xóa thương hiệu!',
            description: response.message,
            duration: 3,
          });

        setBrands((prev) => prev.filter((item) => item._id !== _id));

        return notification.success({
          placement: 'topRight',
          message: 'Xóa thương hiệu thành công!',
          duration: 3,
        });
      },
    });
  };

  const handleUpdateStatus = async (_id, status) => {
    const response = await BRAND_API.updateBrand(_id, {
      status,
    });

    if (response.status === STATUS_FAIL)
      return notification.error({
        placement: 'topRight',
        message: 'Lỗi cập nhật thương hiệu!',
        description: response.message,
        duration: 3,
      });

    return notification.success({
      placement: 'topRight',
      message: 'Cập nhật thương hiệu thành công!',
      duration: 3,
    });
  };

  useEffect(() => {
    (async function () {
      try {
        const response = await BRAND_API.queryBrands(queryStrings || '');

        console.log(response.pagination);

        if (response.status === STATUS_FAIL)
          return console.log(response.message);

        setBrands(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.log(error);
      }
    })();
    //call api here
  }, [queryStrings]);

  useEffect(() => {
    updateQuery();
  }, [searchValue, page]);

  const switchDetailModal = (status) => setDetailModalVisible(status);
  const handleClose = () => {
    switchDetailModal(false);
    setSelectedBrand(null);
  };

  return (
    <div id="brands__page">
      <BrandModal
        onSuccess={handleBrandUpdate}
        onClose={handleClose}
        visible={detailModalVisible}
        data={selectedBrand}
      />
      <div className="brands__page-body">
        <div className="body-filter__section">
          <div className="brand__actions">
            <div
              className="create__brand-button"
              onClick={() => switchDetailModal(true)}
            >
              <Button type="primary">
                Thêm thương hiệu <PlusOutlined />
              </Button>
            </div>
            <div className="brand__actions-search">
              <Input.Group compact>
                <Input
                  style={{ width: 240 }}
                  placeholder="Nhập tên thương hiệu..."
                  onChange={handleSearchChange}
                />
                <Button type="primary">Tìm kiếm</Button>
              </Input.Group>
            </div>
          </div>
        </div>
        <div className="body-wrapper">
          <ul className="brand-records__list">
            <li className="brand-record__wrapper title__record">
              <Row>
                <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                  <div className="title__record-info__section">
                    <Row>
                      <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                        <div className="info__key">Hình ảnh</div>
                      </Col>
                      <Col xl={8} lg={8} sm={8} md={8} xs={8}>
                        <div className="info__key">Tên</div>
                      </Col>
                      <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                        <div className="info__key">Trạng thái</div>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xl={4} lg={4} sm={4} md={4} xs={4}></Col>
                <Col xl={4} lg={4} md={4} sm={24} xs={24}>
                  <div className="title__record-action__section">
                    <Row>
                      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <span className="action__key">Chi tiết</span>
                      </Col>
                      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <span className="action__key">Xóa</span>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </li>
            {brands.map((item) => {
              return (
                <li
                  className="brand-record__wrapper value__record"
                  key={item._id}
                >
                  <BrandRecord
                    data={item}
                    onClick={() => handleBrandClick(item)}
                    onDelete={handleRemoveBrand}
                    onUpdateStatus={handleUpdateStatus}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        {pagination.total > pagination.size && (
          <div className="pagination__container">
            <Pagination
              defaultCurrent={pagination.current}
              total={pagination.total}
              pageSize={pagination.size}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
