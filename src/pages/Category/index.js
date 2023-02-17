import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Input, Modal, notification, Pagination, Row } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import CATEGORY_API from "../../api/category";
import { STATUS_FAIL } from "../../constants/api";
import CategoryModal from "./components/CategoryForm";
import CategoryRecord from "./components/CategoryRecord";
import "./style.scss";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const CategoryPage = () => {
  const queryStrings = window.location.search;
  const query = useQuery();
  const history = useHistory();
  const defaultSearch = query.get("search");
  const defaultPage = query.get("page");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchValue, setSearchValue] = useState(defaultSearch || "null");
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
    let url = "/categories?";
    if (searchValue && searchValue !== "null") url += `search=${searchValue}&`;
    if (page) url += `page=${page}&`;

    history.push(url);
  };

  const handleCategoryClick = (item) => {
    setDetailModalVisible(true);
    setSelectedCategory(item);
  };

  const handleCategoryUpdate = (newData) => {
    const index = categories.findIndex((item) => item._id === newData._id);
    const currentCategories = [...categories];

    if (index > -1) {
      currentCategories[index] = newData;
    } else {
      currentCategories.push(newData);
    }

    setCategories(currentCategories);
    switchDetailModal(false);
  };

  const handleRemoveCategory = async (_id) => {
    Modal.confirm({
      title: "Bạn có muốn xóa thể loại này?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Thể loại đã xóa và các thông tin liên quan sẽ không thể khôi phục lại",
      onOk: async () => {
        const response = await CATEGORY_API.removeCategory(_id);
        if (response.status === STATUS_FAIL)
          return notification.error({
            placement: "topRight",
            message: "Lỗi xóa thể loại!",
            description: response.message,
            duration: 3,
          });

        setCategories((prev) => prev.filter((item) => item._id !== _id));

        return notification.success({
          placement: "topRight",
          message: "Xóa thể loại thành công!",
          duration: 3,
        });
      },
    });
  };

  const handleUpdateStatus = async (_id, status) => {
    const response = await CATEGORY_API.updateCategory(_id, {
      status,
    });

    if (response.status === STATUS_FAIL)
      return notification.error({
        placement: "topRight",
        message: "Lỗi cập nhật thể loại!",
        description: response.message,
        duration: 3,
      });

    return notification.success({
      placement: "topRight",
      message: "Cập nhật thể loại thành công!",
      duration: 3,
    });
  };

  useEffect(() => {
    (async function () {
      try {
        console.log(queryStrings);
        const response = await CATEGORY_API.queryCategories(queryStrings || "");

        if (response.status === STATUS_FAIL)
          return console.log(response.message);

        setCategories(response.data);
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

  const switchDetailModal = (status) => setDetailModalVisible(status);

  const handleClose = () => {
    switchDetailModal(false);
    setSelectedCategory(null);
  };
  return (
    <div id="categories__page">
      <CategoryModal
        onSuccess={handleCategoryUpdate}
        onClose={handleClose}
        visible={detailModalVisible}
        data={selectedCategory}
      />
      <div className="categories__page-body">
        <div className="body-filter__section">
          <div className="category__actions">
            <div
              className="create__category-button"
              onClick={() => switchDetailModal(true)}
            >
              <Button type="primary">
                Thêm thể loại <PlusOutlined />
              </Button>
            </div>
            <div className="category__actions-search">
              <Input.Group compact>
                <Input
                  style={{ width: 240 }}
                  placeholder="Nhập tên thể loại..."
                  onChange={handleSearchChange}
                />
                <Button type="primary">Tìm kiếm</Button>
              </Input.Group>
            </div>
          </div>
        </div>
        <div className="body-wrapper">
          <ul className="category-records__list">
            <li className="category-record__wrapper title__record">
              <Row>
                <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                  <div className="title__record-info__section">
                    <Row>
                      <Col xl={4} lg={4} md={4} sm={4} xs={4}>
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
            {console.log(categories)}
            {categories.map((item) => {
              return (
                <li
                  className="category-record__wrapper value__record"
                  key={item._id}
                >
                  <CategoryRecord
                    data={item}
                    onClick={() => handleCategoryClick(item)}
                    onDelete={handleRemoveCategory}
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

export default CategoryPage;
