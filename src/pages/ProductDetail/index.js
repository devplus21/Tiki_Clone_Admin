import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PRODUCT_API from "../../api/product";
import { STATUS_FAIL, STATUS_OK } from "../../constants/api";
import ProductForm from "../../global-components/ProductForm";
import "./style.scss";

const ProductDetail = () => {
  const { slug } = useParams();
  const [productData, setProductData] = useState(null);
  const [ratesList, setRatesList] = useState([]);

  useEffect(async () => {
    try {
      const response = await PRODUCT_API.getOneProduct(slug);

      if (response.status === STATUS_OK) setProductData(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }, [slug]);

  useEffect(async () => {
    try {
      if (!productData?._id) return;

      const ratesResponse = await PRODUCT_API.queryRates(
        `?product_id=${productData._id}`
      );

      if (ratesResponse.status === STATUS_FAIL)
        return console.log(ratesResponse.message);

      setRatesList(ratesResponse.data);
    } catch (error) {
      console.log(error.message);
    }
  }, [productData]);

  const avgStar = useMemo(() => {
    if (!ratesList.length) return 0;

    const hasStarsList = ratesList.filter((item) => item.stars);
    const totalStars = hasStarsList.reduce((prev, cur) => {
      return cur.stars + prev;
    }, 0);

    return totalStars > 0
      ? Number(totalStars / hasStarsList.length).toFixed(1)
      : 0;
  }, [ratesList]);

  console.log("productData", productData);

  return (
    <div id="product__detail__page">
      {productData && (
        <ProductForm
          rateQty={ratesList.length}
          data={productData}
          avgStar={avgStar}
        />
      )}
    </div>
  );
};

export default ProductDetail;
