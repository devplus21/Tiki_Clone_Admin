import { Col, Pagination, Row } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import RATE_API from '../../api/rate';
import { STATUS_FAIL } from '../../constants/api';
import DetailRateModal from './components/DetailRateModal';
import RateRecord from './components/RateRecord';
import './style.scss';

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const RatePage = () => {
  const queryStrings = window.location.search;
  const query = useQuery();
  const history = useHistory();
  const defaultSearch = query.get('search');
  const defaultPage = query.get('page');

  // const { userInfo } = useSelector((state) => state.common);
  const userInfo = {};

  const [rates, setRates] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchValue, setSearchValue] = useState(defaultSearch || 'null');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [page, setPage] = useState(defaultPage);

  const toggleDetailModal = (status = !detailModalVisible) => {
    setDetailModalVisible(status);
  };

  const handleSelectRate = (data) => {
    setSelectedRate(data);
  };

  const handleCloseRate = () => {
    toggleDetailModal(false);
    setSelectedRate(null);
  };

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
    let url = '/rates?';
    if (searchValue && searchValue !== 'null') url += `search=${searchValue}&`;
    if (page) url += `page=${page}&`;

    history.push(url);
  };

  useEffect(async () => {
    try {
      const response = await RATE_API.queryAllRates(queryStrings || '');

      if (response.status === STATUS_FAIL) return console.log(response.message);

      console.log(response);
      setRates(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.log(error);
    }
  }, [queryStrings]);

  useEffect(() => {
    updateQuery();
  }, [page, searchValue]);


  const handleClickDelete = (id) => {
    setRates(rates.filter(rate => rate._id !== id));
  }

  return (
    <div id="rates__page">
      <DetailRateModal data={selectedRate} onClose={handleCloseRate} />
      <div className="rates__page-body">
        <div className="body-filter__section">
          {/* <div className="rate__actions">
            <div className="rate__actions-search">
              <Input.Group compact>
                <Input
                  style={{ width: 240 }}
                  placeholder="Nhập tên thương hiệu..."
                  onChange={handleSearchChange}
                />
                <Button type="primary">Tìm kiếm</Button>
              </Input.Group>
            </div>
          </div> */}
        </div>
        <div className="body-wrapper">
          <ul className="rate-records__list">
            <li className="rate-record__wrapper title__record">
              <Row>
                <Col xl={14} lg={14} md={14} sm={24} xs={24}>
                  <div className="title__record-info__section">
                    <Row>
                      <Col xl={8} lg={8} sm={8} md={8} xs={8}>
                        <div className="info__key">Người đánh giá</div>
                      </Col>
                      <Col xl={8} lg={8} sm={8} md={8} xs={8}>
                        <div className="info__key">Số sao</div>
                      </Col>
                      <Col xl={8} lg={8} sm={8} md={8} xs={8}>
                        <div className="info__key">Sản phẩm</div>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xl={6} lg={6} sm={6} md={6} xs={6}></Col>
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
            {rates.map((item) => {
              return (
                <li
                  className="rate-record__wrapper value__record"
                  key={item._id}
                >
                  <RateRecord
                    onClick={() => handleSelectRate(item)}
                    handleClickDelete={handleClickDelete}
                    data={item}
                  />
                </li>
              );
            })}
          </ul>
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
    </div>
  );
};

export default RatePage;
