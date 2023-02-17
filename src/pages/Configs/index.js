import { Button, Col, Form, Input, notification, Row } from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import CONFIGS_API from "../../api/config";
import { STATUS_FAIL } from "../../constants/api";
import UploadThumbnail from "../../global-components/UploadThumbnail";
import { useAppSelector } from "../../hooks/store";
import "./style.scss";

const ConfigsPage = () => {
  const [form] = Form.useForm();
  const { configs } = useAppSelector((state) => state.common);

  useEffect(() => {
    form.setFieldsValue(configs);
  }, [form, configs]);

  const [banner1, setBanner1] = useState(configs?.banner1);
  const [banner2, setBanner2] = useState(configs?.banner2);
  const [banner3, setBanner3] = useState(configs?.banner3);
  const [subBanner, setSubBanner] = useState(configs?.sub_banner);

  const handleFormSubmit = async (values) => {
    values.banner_url_1 = banner1;
    values.banner_url_2 = banner2;
    values.banner_url_3 = banner3;
    values.sub_banner = subBanner;

    values = _.omitBy(values, _.isNil);

    try {
      const response = await CONFIGS_API.updateConfigs(values);
      if (response.status === STATUS_FAIL)
        return notification.error({
          placement: "topRight",
          message: "Cập nhật thất bại!",
          description: response.message,
          duration: 3,
        });

      return notification.success({
        placement: "topRight",
        message: "Cập nhật thành công!",
        description: response.message,
        duration: 3,
      });
    } catch (error) {
      return notification.error({
        placement: "topRight",
        message: "Cập nhật thất bại!",
        description: error.message,
        duration: 3,
      });
    }
  };

  const handleUploadSuccess1 = (value) => {
    if (value)
      setBanner1({
        image_url: value.url,
        image_id: value.public_id,
      });
  };

  const handleUploadSuccess2 = (value) => {
    if (value)
      setBanner2({
        image_url: value.url,
        image_id: value.public_id,
      });
  };

  const handleUploadSuccess3 = (value) => {
    if (value)
      setBanner3({
        image_url: value.url,
        image_id: value.public_id,
      });
  };

  const handleUploadSuccess4 = (value) => {
    if (value)
      setSubBanner({
        image_url: value.url,
        image_id: value.public_id,
      });
  };

  useEffect(() => {
    setBanner1(configs?.banner_url_1);
    setBanner2(configs?.banner_url_2);
    setBanner3(configs?.banner_url_3);
    setSubBanner(configs?.sub_banner);
  }, [configs]);

  return (
    <div className="configs__page">
      <div className="configs-body">
        <Row>
          <Col xl={14} lg={14} md={14} sm={14} xs={14}>
            <div className="body-form">
              <Form
                name="product_detail"
                layout="vertical"
                onFinish={handleFormSubmit}
                autoComplete="off"
                form={form}
              >
                <h4>Banners</h4>
                <div className="banner__upload__list">
                  <UploadThumbnail
                    onSuccess={handleUploadSuccess1}
                    defaultFile={
                      (banner1 && {
                        url: banner1.image_url,
                        public_id: banner1.image_id,
                      }) ||
                      null
                    }
                  />
                  <UploadThumbnail
                    onSuccess={handleUploadSuccess2}
                    defaultFile={
                      (banner2 && {
                        url: banner2.image_url,
                        public_id: banner2.image_id,
                      }) ||
                      null
                    }
                  />
                  <UploadThumbnail
                    onSuccess={handleUploadSuccess3}
                    defaultFile={
                      (banner3 && {
                        url: banner3.image_url,
                        public_id: banner3.image_id,
                      }) ||
                      null
                    }
                  />
                </div>
                <h4>Sub Banner</h4>
                <div className="sub__banner__upload__list">
                  <UploadThumbnail
                    onSuccess={handleUploadSuccess4}
                    defaultFile={
                      subBanner
                        ? {
                          url: subBanner.image_url,
                          public_id: subBanner.image_id,
                        }
                        : null
                    }
                  />
                </div>
                <Form.Item label="Tên page" name="page_name">
                  <Input placeholder="Tên Website..." />
                </Form.Item>
                <Form.Item label="Slogan" name="slogan">
                  <Input placeholder="Slogan..." />
                </Form.Item>
                <Form.Item label="Address" name="address">
                  <Input placeholder="Address..." />
                </Form.Item>
                <Form.Item label="Hotline" name="hotline">
                  <Input placeholder="Hotline..." />
                </Form.Item>
                <Form.Item label="Facebook" name="facebook">
                  <Input placeholder="Facebook..." />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input placeholder="Email..." />
                </Form.Item>
                <Form.Item label="Youtube" name="youtube">
                  <Input placeholder="Youtube..." />
                </Form.Item>
                <Form.Item label="Copyright" name="copyright">
                  <Input placeholder="Copyright..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Lưu lại
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ConfigsPage;
