import {
  ExclamationCircleOutlined,
  FilterFilled,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Drawer,
  Input,
  Modal,
  notification,
  Pagination,
  Radio,
  Row,
  Slider,
} from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BRAND_API from '../../api/brand';
import CATEGORY_API from '../../api/category';
import PRODUCT_API from '../../api/product';
import { INLAND, OVERSEA, STATUS_FAIL } from '../../constants/api';
import useAuthoriztion from '../../hooks/redirect';
import { formatNumber } from '../../utils';
import CheckboxGroup from './components/CheckboxGroup';
import FilterWrapper from './components/FilterWrapper';
import ProductRecord from './components/ProductRecord';
import RadioGroup from './components/RadioGroup';
import './style.scss';

const { confirm } = Modal;

const rateOptions = [
  {
    _id: 'ALL',
    label: 'Tất cả',
    value: 'null',
  },
  {
    _id: '3',
    label: '3 Sao trở lên',
    value: '3',
  },
  {
    _id: '4',
    label: '4 Sao trở lên',
    value: '4',
  },
  {
    _id: '5',
    label: '5 Sao trở lên',
    value: '5',
  },
];

const originOptions = [
  {
    _id: 'ALL',
    label: 'Tất cả',
    value: 'null',
  },
  {
    _id: OVERSEA,
    label: 'Nước ngoài',
    value: OVERSEA,
  },
  {
    _id: INLAND,
    label: 'Trong nước',
    value: INLAND,
  },
];

const sortOptions = [
  {
    _id: '1',
    lable: 'Giá tăng dần',
    value: '1',
    type: 'price',
  },
  {
    _id: '2',
    lable: 'Giá giảm dần',
    value: '-1',
    type: 'price',
  },
  {
    _id: '3',
    lable: 'Sản phẩm mới',
    value: '-1',
    type: 'createdAt',
  },
  {
    _id: '4',
    lable: 'Sắp hết hàng',
    value: '1',
    type: 'stock',
  },
];

const priceRange = [0, 100000000];

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const ProductPage = () => {
  const query = useQuery();
  const { redirect } = useAuthoriztion();
  const search = window.location.search;

  const [filtersVisible, setFilterVisible] = useState(false);

  const defaultMaxPrice = query.get('max_price');
  const defaultMinPrice = query.get('min_price');
  const defaultRate = query.get('rate');
  const defaultCategories = query.get('categories');
  const defaultOrigin = query.get('origin');
  const defaultBrand = query.get('brand');
  const defaultPage = query.get('page');
  const defaultSearch = query.get('search');
  const defaultSort = query.get('sort');
  const defaultSortValue = query.get('sort_value');

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [brandsOptions, setBrandsOptions] = useState([]);
  const [prices, setPrices] = useState([defaultMinPrice, defaultMaxPrice]);
  const [rate, setRate] = useState(defaultRate || 'null');
  const [origin, setOrigin] = useState(defaultOrigin || 'null');
  const [categories, setCategories] = useState(defaultCategories?.split(','));
  const [brand, setBrand] = useState(defaultBrand || 'null');
  const [sort, setSort] = useState(defaultSort);
  const [searchValue, setSearchValue] = useState(defaultSearch || 'null');
  const [sortValue, setSortValue] = useState(defaultSortValue);
  const [page, setPage] = useState(defaultPage);

  const [minPrice, maxPrice] = prices;
  const sortId = useMemo(() => {
    let sortObj = sortOptions.find(
      (item) => item.type === sort && item.value === sortValue
    );

    return sortObj?._id;
  }, [sort, sortValue]);

  const debouceSearch = useCallback(
    debounce((nextValue) => setSearchValue(nextValue), 1000),
    []
  );

  const switchFiltersVisible = (status) => {
    setFilterVisible(status);
  };

  const handleCategoriesChange = (value) => {
    setCategories(value);
  };

  const handleBrandsChange = ({ target: { value } }) => {
    setBrand(value);
  };

  const handleOriginChange = ({ target: { value } }) => {
    setOrigin(value);
  };

  const handlePriceChange = (value) => {
    setPrices(value);
  };

  const handleRateChange = ({ target: { value } }) => {
    setRate(value);
  };

  const handleSortChange = ({ target: { value } }) => {
    const sortObj = sortOptions.find((item) => item._id === value);

    setSort(sortObj.type);
    setSortValue(sortObj.value);
    setPage(1);
  };

  const handleSearchChange = ({ target: { value } }) => {
    debouceSearch(value);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleRemoveProduct = async (_id) => {
    confirm({
      title: 'Bạn có muốn xóa sản phẩm này?',
      icon: <ExclamationCircleOutlined />,
      content:
        'Sản phẩm đã xóa và các thông tin liên quan sẽ không thể khôi phục lại',
      onOk: async () => {
        const response = await PRODUCT_API.removeProduct(_id);
        if (response.status === STATUS_FAIL)
          return notification.error({
            placement: 'topRight',
            message: 'Lỗi xóa sản phẩm!',
            description: response.message,
            duration: 3,
          });

        setProducts((prev) => prev.filter((item) => item._id !== _id));

        return notification.success({
          placement: 'topRight',
          message: 'Xóa sản phẩm thành công!',
          duration: 3,
        });
      },
    });
  };

  const updateQuery = () => {
    let url = '/products?';
    if (minPrice) url += `min_price=${minPrice}&`;
    if (maxPrice) url += `max_price=${maxPrice}&`;
    if (rate && rate !== 'null') url += `rate=${rate}&`;
    if (origin && origin !== 'null') url += `origin=${origin}&`;
    if (categories?.length > 0) url += `categories=${categories.join(',')}&`;
    if (brand && brand !== 'null') url += `brand=${brand}&`;
    if (searchValue && searchValue !== 'null') url += `search=${searchValue}&`;
    if (sort && sortValue) url += `sort=${sort}&sort_value=${sortValue}&`;
    if (page) url += `page=${page}&`;

    redirect(url);
  };

  useEffect(() => {
    (async function () {
      try {
        const response = await PRODUCT_API.queryProducts(search || '');

        if (response.status === STATUS_FAIL)
          return console.log(response.message);

        setProducts(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.log(error);
      }
      //call api here
    })();
  }, [search]);

  useEffect(() => {
    (async function () {
      try {
        const categoriesResponse = await CATEGORY_API.queryCategories('');

        if (categoriesResponse.status === STATUS_FAIL)
          return console.log(categoriesResponse.message);

        setCategoriesOptions(
          categoriesResponse.data.map((item) => ({
            _id: item._id,
            value: item._id,
            label: item.name,
          }))
        );

        const brandsResponse = await BRAND_API.queryBrands('');

        if (brandsResponse.status === STATUS_FAIL)
          return console.log(brandsResponse.message);

        setBrandsOptions([
          {
            _id: 'ALL',
            value: 'null',
            label: 'Tất cả',
          },
          ...brandsResponse.data.map((item) => ({
            _id: item._id,
            value: item._id,
            label: item.name,
          })),
        ]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    updateQuery();
  }, [
    prices,
    rate,
    origin,
    categories,
    brand,
    sort,
    searchValue,
    sortValue,
    page,
  ]);

  const Filters = (
    <div className="product__filters">
      <div className="filters-wrapper">
        <FilterWrapper title="THỂ LOẠI">
          <CheckboxGroup
            onChange={handleCategoriesChange}
            data={categoriesOptions}
            defaultValue={categories}
          />
        </FilterWrapper>
        <FilterWrapper title="THƯƠNG HIỆU">
          <RadioGroup
            name="brand"
            data={brandsOptions}
            defaultValue={brand}
            onChange={handleBrandsChange}
          />
        </FilterWrapper>
        <FilterWrapper title="XUẤT XỨ">
          <RadioGroup
            name="origin"
            defaultValue={origin}
            data={originOptions}
            onChange={handleOriginChange}
          />
        </FilterWrapper>
        <FilterWrapper title="KHOẢNG GIÁ">
          <div className="price__range-container">
            <span className="price__range-number">
              {formatNumber(minPrice || priceRange[0])}đ
            </span>
            <span className="price__range-number">
              {formatNumber(maxPrice || priceRange[1])}đ
            </span>
          </div>
          <Slider
            onAfterChange={handlePriceChange}
            range
            min={priceRange[0]}
            max={priceRange[1]}
            defaultValue={[
              minPrice || priceRange[0],
              maxPrice || priceRange[1],
            ]}
            step={500000}
          />
        </FilterWrapper>
        <FilterWrapper title="ĐÁNH GIÁ">
          <RadioGroup
            name="rate"
            data={rateOptions}
            onChange={handleRateChange}
            defaultValue={rate}
          />
        </FilterWrapper>
      </div>
    </div>
  );

  return (
    <div id="products__page">
      <Drawer
        width={320}
        title="Bộ lọc"
        placement={'right'}
        closable={true}
        onClose={() => switchFiltersVisible(false)}
        visible={filtersVisible}
        getContainer="#products__page"
      >
        {Filters}
      </Drawer>
      <div className="products__page-body">
        <div className="body-filter__section">
          <div className="product__actions">
            <div className="create__product-button">
              <Button
                onClick={() => redirect('/products/create')}
                type="primary"
              >
                Thêm sản phẩm <PlusOutlined />
              </Button>
            </div>
            <div className="product__actions-search">
              <Input.Group compact>
                <Input
                  style={{ width: 240 }}
                  placeholder="Nhập tên sản phẩm..."
                  onChange={handleSearchChange}
                />
                <Button type="primary">Tìm kiếm</Button>
              </Input.Group>
            </div>
            <div className="product__actions-right__section">
              <div className="action-sorts">
                <Radio.Group
                  onChange={handleSortChange}
                  defaultValue={sortId}
                  size="middle"
                  name="sort"
                >
                  {sortOptions.map((item) => (
                    <Radio.Button key={item._id} value={item._id}>
                      {item.lable}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
              <Button onClick={() => switchFiltersVisible(true)}>
                Bộ lọc <FilterFilled />
              </Button>
            </div>
          </div>
        </div>
        <div className="body-wrapper">
          <ul className="product-records__list">
            <li className="product-record__wrapper title__record">
              <Row>
                <Col xl={20} lg={20} md={20} sm={24} xs={24}>
                  <div className="title__record-info__section">
                    <Row>
                      <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                        <div className="info__key">Hình ảnh</div>
                      </Col>
                      <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                        <div className="info__key">Tên</div>
                      </Col>
                      <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                        <div className="info__key">Số lượng</div>
                      </Col>
                      <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                        <div className="info__key">Đã bán</div>
                      </Col>
                      <Col xl={4} lg={4} sm={4} md={4} xs={4}>
                        <div className="info__key">Giá</div>
                      </Col>
                      <Col xl={2} lg={2} sm={2} md={2} xs={2}>
                        <div className="info__key">Trạng thái</div>
                      </Col>
                    </Row>
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
            {products.map((item) => {
              return (
                <li
                  className="product-record__wrapper value__record"
                  key={item._id}
                >
                  <ProductRecord data={item} onDelete={handleRemoveProduct} />
                </li>
              );
            })}
          </ul>
        </div>
        {pagination.total > pagination.size && (
          <div className="pagination__container">
            <Pagination
              current={Number(page) || 1}
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

export default ProductPage;
