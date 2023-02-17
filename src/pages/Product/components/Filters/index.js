import "./style.scss";
import { Input, Button, Select } from "antd";

const { Option } = Select;
function handleChange(value) {
  console.log(`selected ${value}`);
}

const ProductFilters = () => {
  return (
    <div className="resource">
      <div className="resource-search">
        <Input.Group compact>
          <Input style={{ width: 240 }} placeholder="Nhập tên sản phẩm..." />
          <Button type="primary">Tìm kiếm</Button>
        </Input.Group>
      </div>
      <div className="resource-select">
        <Select
          defaultValue="Tất cả"
          style={{ width: 180 }}
          onChange={handleChange}
        >
          <Option value="sales">Sales</Option>
          <Option value="sold">Đã bán</Option>
          <Option value="new">Hàng mới về</Option>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilters;
