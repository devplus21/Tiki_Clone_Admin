import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, notification, Pagination, Row } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import USER_API from '../../api/user';
import { STATUS_FAIL } from '../../constants/api';
import UserModal from './components/UserModal';
import UserRecord from './components/UserRecord';
import './style.scss';
const { confirm } = Modal;
function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const UserPage = () => {
  const queryStrings = window.location.search;
  const query = useQuery();
  const history = useHistory();
  const defaultSearch = query.get('search');
  const defaultPage = query.get('page');

  const [selectedStaff, setSelectedStaff] = useState(null);
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
    let queries = '?role=2&';
    if (searchValue && searchValue !== 'null')
      queries += `search=${searchValue}&`;
    if (page) queries += `page=${page}&`;

    history.push(`/users${queries}`);
  };

  const handleSelectStaff = (item) => {
    setSelectedStaff(item);
  };

  const handleCloseModal = () => {
    setSelectedStaff(null);
  };

  const handleRemove = (_id) => {
    try {
      const response = USER_API.removeUser(_id);
      if (response.status === STATUS_FAIL)
        return notification.error({
          placement: 'topRight',
          message: 'Xóa người dùng thất bại!',
          description: response.message,
          duration: 3,
        });

      setStaffs((prev) => prev.filter((usr) => usr._id !== _id));
      return notification.success({
        placement: 'topRight',
        message: 'Xóa người dùng thành công!',
        duration: 3,
      });
    } catch (error) {
      return notification.error({
        placement: 'topRight',
        message: 'Xóa người dùng thất bại!',
        description: error.message,
        duration: 3,
      });
    }
  };

  const handleRemoveClick = async (_id) => {
    confirm({
      title: 'Bạn có muốn xóa người dùng này?',
      icon: <ExclamationCircleOutlined />,
      onOk: () => handleRemove(_id),
    });
  };

  useEffect(() => {
    (async function () {
      try {
        const response = await USER_API.queryUsers(queryStrings || '');

        if (response.status === STATUS_FAIL)
          return console.log(response.message);

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
      <UserModal data={selectedStaff} onClose={handleCloseModal} />
      <div className="staffs__page-body">
        <div className="body-filter__section">
          <div className="staff__actions">
            <div />
            <div className="staff__actions-search">
              <Input.Group compact>
                <Input
                  style={{ width: 240 }}
                  placeholder="Nhập tên người dùng"
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
                <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                  <div className="info__key">
                    <span>Số điện thoại</span>
                  </div>
                </Col>
                <Col xl={8} lg={8} sm={8} md={8} xs={8}>
                  <div className="info__key">
                    <span>Địa chỉ</span>
                  </div>
                </Col>
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
                  <UserRecord
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

export default UserPage;
