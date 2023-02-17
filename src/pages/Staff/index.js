import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, notification, Pagination, Row } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import USER_API from '../../api/user';
import { STATUS_FAIL } from '../../constants/api';
import StaffModal from './components/StaffModal';
import StaffRecord from './components/StaffRecord';
import './style.scss';
const { confirm } = Modal;
function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const StaffPage = () => {
  const queryStrings = window.location.search;
  const query = useQuery();
  const history = useHistory();
  const defaultSearch = query.get('search');
  const defaultPage = query.get('page');

  // const { userInfo } = useSelector((state) => state.common);
  const userInfo = {};

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchValue, setSearchValue] = useState(defaultSearch || 'null');

  const [page, setPage] = useState(defaultPage);

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
    let queries = '?role=1&';
    if (searchValue && searchValue !== 'null')
      queries += `search=${searchValue}&`;
    if (page) queries += `page=${page}&`;

    history.push(`/staffs${queries}`);
  };

  const handleSelectStaff = (item) => {
    setSelectedStaff(item);
    setDetailModalVisible(true);
  };

  const handleCloseModal = () => {
    setDetailModalVisible(false);
    setSelectedStaff(null);
  };

  const handleSubmitModal = (newData) => {
    const index = staffs.findIndex((item) => item._id === newData._id);
    const currentStaffs = [...staffs];
    if (index >= 0) {
      currentStaffs[index] = newData;
    } else {
      currentStaffs.push(newData);
    }

    setStaffs(currentStaffs);
  };

  const handleRemove = async (_id) => {
    try {
      const response = await USER_API.removeStaff(_id);
      if (response.status === STATUS_FAIL)
        return notification.error({
          placement: 'topRight',
          message: 'Xóa nhân viên thất bại!',
          description: response.message,
          duration: 3,
        });

      setStaffs((prev) => prev.filter((usr) => usr._id !== _id));
      return notification.success({
        placement: 'topRight',
        message: 'Xóa nhân viên thành công!',
        duration: 3,
      });
    } catch (error) {
      return notification.error({
        placement: 'topRight',
        message: 'Xóa nhân viên thất bại!',
        description: error.message,
        duration: 3,
      });
    }
  };

  const handleRemoveClick = async (_id) => {
    confirm({
      title: 'Bạn có muốn xóa nhân viên này?',
      icon: <ExclamationCircleOutlined />,
      onOk: () => handleRemove(_id),
    });
  };

  useEffect(() => {
    (async function () {
      try {
        const response = await USER_API.queryUsers(queryStrings || '?role=1');

        if (response.status === STATUS_FAIL)
          return console.log(response.message);

        console.log(response);

        setStaffs(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.log(error);
      }
      //call api here
    })();
  }, [queryStrings]);

  useEffect(() => {
    updateQuery();
  }, [searchValue, page]);

  return (
    <div id="staffs__page">
      <StaffModal
        onSuccess={handleSubmitModal}
        data={selectedStaff}
        visible={detailModalVisible}
        onClose={handleCloseModal}
      />
      <div className="staffs__page-body">
        <div className="body-filter__section">
          <div className="staff__actions">
            <div className="create__staff-button">
              <Button
                onClick={() => setDetailModalVisible(true)}
                type="primary"
              >
                Thêm nhân viên <PlusOutlined />
              </Button>
            </div>
            <div className="staff__actions-search">
              <Input.Group compact>
                <Input
                  style={{ width: 240 }}
                  placeholder="Nhập tên nhân viên..."
                  onChange={handleSearchChange}
                />
                <Button type="primary">Tìm kiếm</Button>
              </Input.Group>
            </div>
          </div>
        </div>
        <div className="body-wrapper">
          <ul className="staff-records__list">
            <li className="staff-record__wrapper title__record">
              <Row>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <div className="title__record-info__section">
                    <Row>
                      <Col xl={16} lg={16} sm={16} md={16} xs={16}>
                        <div className="info__key">Tên</div>
                      </Col>
                      <Col xl={8} lg={8} sm={8} md={8} xs={8}>
                        <div className="info__key">
                          <span>Ngày tạo</span>
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
            {staffs.map((item) => {
              return (
                <li
                  className="staff-record__wrapper value__record"
                  key={item._id}
                >
                  <StaffRecord
                    onClick={handleSelectStaff}
                    data={item}
                    onDelete={handleRemoveClick}
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

export default StaffPage;
