import { Link } from "react-router-dom";
import { formatNumber } from "../../../utils";
import "./style.scss";

const OrderItem = ({ data }) => {
  return (
    <div className="order-item">
      <div className="order-item__thumbnail">
        <div className="thumbnail__img">
          <img src={data.product?.thumbnail_url} alt={data.product?.name} />
        </div>
      </div>
      <div className="order-item__content">
        <div className="content__product-name">
          <Link to={`/products/${data.product?.slug}`} className="name">
            {data.product?.name}
            <span className="thumbnail__quantity">(x{data.quantity})</span>
          </Link>
        </div>
        <div className="content__product-brand">
          <img
            src={data.product?.brand?.image_url}
            alt={data.product?.brand?.name}
          />
          <p className="brand">{data.product?.brand?.name}</p>
        </div>
      </div>
      <div style={{ textAlign: "right" }} className="order-item__price">
        <p className="price">{formatNumber(data.item_price)}đ</p>
      </div>
    </div>
  );
};

export default OrderItem;
