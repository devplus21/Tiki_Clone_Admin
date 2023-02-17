import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Rate,
  Row,
  Switch,
} from "antd";
import BsonObjectId from "bson-objectid";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import BRAND_API from "../../api/brand";
import PRODUCT_API from "../../api/product";
import { STATUS_FAIL, STATUS_OK } from "../../constants/api";
import useRedirect from "../../hooks/redirect";
import CategoriesSelector from "../CategoriesSelector";
import Editor from "../Editor";
import ImageUploadPanel from "../ImageUploadPanel";
import UploadThumbnail from "../UploadThumbnail";
import "./style.scss";

const defaultValue = {
  sale_percent: 0,
};
const objectId = BsonObjectId();

const ProductForm = ({ rateQty = 0, data, avgStar }) => {
  const { redirect } = useRedirect();
  const [_id, setId] = useState(data ? data._id : objectId);
  const [isBrandModalVisible, setIsBrandModalVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [product, setProduct] = useState([]);
  const [formReset, setFormReset] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [status, setStatus] = useState(data ? data.status : true);
  const [description, setDescription] = useState(data?.description || "");
  const [errorMessage, setErrorMessage] = useState(null);
  const [inHome, setInHome] = useState(data ? data.in_home : false);
  const [thumbnailImage, setThumbnailImage] = useState(
    data
      ? {
        public_id: data.thumbnail_id,
        url: data.thumbnail_url,
      }
      : null
  );

  const categories = useMemo(() => {
    return data?.categories;
  }, [data]);

  const handleSelectBrand = (br) => {
    setSelectedBrand(br);
  };

  const showModal = () => {
    setIsBrandModalVisible(true);
  };

  const handleBrandSubmit = () => {
    setIsBrandModalVisible(false);
  };

  const handleCancel = () => {
    setIsBrandModalVisible(false);
  };

  function handleStatusChange(value) {
    setStatus(value);
  }

  function handleinHomeChange(value) {
    setInHome(value);
  }

  const handleSubmitCategories = (items) => {
    setSelectedCategories(items);
  };



  const handleFormSubmit = async (values) => {
    let payload = {
      // _id,
      ...values,
      status: status || true,
      in_home: inHome,
      categories: selectedCategories?.map((item) => item.value),
      brand: selectedBrand?._id,
      description: description.trim(),
      thumbnail_url: thumbnailImage?.url,
      thumbnail_id: thumbnailImage?.public_id,
    };

    const indexDuplicatedName = product?.findIndex((x) => x?.name?.trim()?.toLowerCase() === values?.name?.trim().toLowerCase());
    if (indexDuplicatedName !== -1) return setErrorMessage("Tên sản phẩm đã tồn tại trong cửa hàng!")

    if (!payload.thumbnail_url)
      return setErrorMessage("Hình ảnh hiển thị không được bỏ trống");

    if (!data) {
      if (!payload.brand)
        return setErrorMessage("Thương hiệu không được bỏ trống");

      if (!payload.categories || payload.categories?.length === 0)
        return setErrorMessage("Thể loại không được bỏ trống");

      const response = await PRODUCT_API.createProduct(payload);

      console.log('payload', payload);

      if (response.status === STATUS_FAIL)
        return setErrorMessage(response.message);

      return redirect("/products");
    } else {
      payload = _.omitBy(payload, _.isNil);
      const response = await PRODUCT_API.updateProduct(_id, payload);

      if (response.status === STATUS_FAIL)
        return setErrorMessage(response.message);

      return redirect("/products");
    }
  };

  const initialFormValues = useMemo(() => data || defaultValue, [data]);
  const currentBrand = useMemo(
    () => selectedBrand || data?.brand,
    [selectedBrand, data]
  );
  const defaultThumbnail = useMemo(() => {
    if (data)
      return {
        status: "done",
        publicId: data.thumbnail_id,
        url: data.thumbnail_url,
        percent: 100,
      };
    else return undefined;
  }, [data]);

  const brandItem = (br) => (
    <div className="brands-item-wrapper">
      <img src={br.image_url} alt={br.name} />
      <div className="brands-info">
        <span className="brands-name">{br.name}</span>
        <span className="brands-symbol">{br.description}</span>
      </div>
      {br._id === currentBrand?._id && (
        <span className="active-icon">
          <CheckOutlined color="green" />
        </span>
      )}
    </div>
  );

  useEffect(() => {
    if (errorMessage)
      return notification.error({
        placement: "topRight",
        message: "Lỗi!",
        description: errorMessage,
        duration: 3,
      });
  }, [errorMessage]);

  useEffect(() => {
    (async function () {
      try {
        const response = await BRAND_API.getAllBrand();

        if (response.status === STATUS_OK) setBrands(response.data);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (data)
      setThumbnailImage({
        public_id: data.thumbnail_id,
        url: data.thumbnail_url,
      });
  }, [data]);

  useEffect(() => {
    if (!data) setFormReset(preState => !preState);
  }, [])

  useEffect(() => {
    (async () => {
      const getAllProduct = await PRODUCT_API.getAllProduct();
      setProduct(getAllProduct.data)
    })();
  }, [])

  return (
    <div className="product__form">
      <Modal
        title={"Thương hiệu"}
        visible={isBrandModalVisible}
        onOk={handleBrandSubmit}
        onCancel={handleCancel}
        centered
        destroyOnClose
      >
        <div className="brands-modal-body">
          {/* <Search
                        size="middle"
                        placeholder="Search"
                        onSearch={() => {}}
                        enterButton
                      /> */}
          <ul>
            {brands?.length > 0 &&
              brands.map((item) => (
                <li key={item._id} onClick={() => handleSelectBrand(item)}>
                  {brandItem(item)}
                </li>
              ))}
          </ul>
        </div>
      </Modal>
      <div className="product__form-body">
        <h1 className="body-heading">
          {data ? "Thông tin sản phẩm" : "Thêm sản phẩm"}
        </h1>
        <div className="body-form">
          <Form
            name="product_detail"
            layout="vertical"
            onFinish={handleFormSubmit}
            autoComplete="off"
            initialValues={initialFormValues}
          >
            {data && (
              <Form.Item label="Mã sản phẩm" name="_id">
                <Input disabled />
              </Form.Item>
            )}
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: "Thêm tên sản phẩm" }]}
            >
              <Input placeholder="Tên sản phẩm..." />
            </Form.Item>
            <div className="form__item thumbnail__image">
              <div className="form__item-title">Hình ảnh hiển thị</div>
              <UploadThumbnail
                defaultFile={defaultThumbnail}
                onSuccess={setThumbnailImage}
              />
            </div>
            <div className="form__item image__list">
              <div className="form__item-title">Hình ảnh chi tiết</div>
              <ImageUploadPanel productId={_id} formReset={formReset} data={data} />
            </div>
            <Form.Item
              label="Số lượng"
              name="stock"
              rules={
                !data
                  ? [{ required: true, message: "Nhập số lượng sản phẩm" }]
                  : null
              }
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item>
              <Row>
                <Col>
                  <Form.Item
                    label="Giá"
                    name="price"
                    className="ant-form-item-price"
                    rules={
                      !data
                        ? [
                          {
                            required: true,
                            message: "Giá sản phẩm không được để trống",
                          },
                        ]
                        : null
                    }
                  >
                    <InputNumber
                      min={1}
                      step={1000}
                      prefix="VND"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      autoCapitalize
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    label="Giảm giá"
                    name="sale_percent"
                    className="ant-form-item-sales"
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      formatter={(value) => `% ${value}`}
                      style={{ width: 100 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            {data && (
              <Form.Item name="status" label="Trạng thái">
                <Switch defaultChecked={status} onChange={handleStatusChange} />
              </Form.Item>
            )}
            <div className="brand form__item">
              <div className="form__item-title">Thương hiệu</div>
              <div className="brand-content">
                {currentBrand && (
                  <>
                    <div className="brand-thumb">
                      <img src={currentBrand?.image_url} alt="brand" />
                    </div>
                    <div className="brand-name">{currentBrand?.name}</div>
                  </>
                )}
                <Button type="primary" onClick={showModal}>
                  {(data && "Thay đổi") || "Chọn thương hiệu"}
                </Button>
              </div>
            </div>
            {data && (
              <div className="form__item rating">
                <div className="form__item-title">Đánh giá</div>
                <div className="rating-content">
                  <div className="rating-point">{avgStar}</div>
                  <div className="rating-overview">
                    <div className="rating-stars">
                      <Rate allowHalf disabled value={avgStar || 0} />
                    </div>
                    <div style={{ marginTop: 8 }} className="rating-review">
                      {rateQty + " "} nhận xét
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="form__item">
              <div className="form__item-title">Thể loại</div>
              <div className="form__item-content">
                <CategoriesSelector
                  onSubmit={handleSubmitCategories}
                  defaultItems={categories}
                  defaultChecked={selectedCategories}
                />
              </div>
            </div>
            <Form.Item name="in_home" label="Hiển thị trang chủ">
              <Switch defaultChecked={inHome} onChange={handleinHomeChange} />
            </Form.Item>
            <div className="form__item">
              <div className="form__item-title">Mô tả sản phẩm</div>
              <div className="form__item-content">
                <Editor
                  defauleDesc={description}
                  onDescChange={setDescription}
                />
              </div>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu lại
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
