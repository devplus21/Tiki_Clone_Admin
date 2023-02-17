import { Modal, Rate } from "antd";
import React from "react";

const DetailRateModal = ({ data, onClose }) => {
  async function updateRateStatus(checked) {
    // try {
    //   const response = await PRODUCT_API.updateProduct(data._id, {
    //     status: checked,
    //   });
    //   if (response.status === STATUS_OK);
    //   setRateStatus(checked);
    // } catch (error) {
    //   console.log(error.message);
    // }
  }

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal
      onCancel={handleClose}
      title="Chi tiết đánh giá"
      visible={!!data}
      footer={null}
      destroyOnClose
    >
      <div className="rate__detail-star" style={{ marginBottom: 20 }}>
        <h4 className="star-title">Đánh giá</h4>
        <Rate value={data?.stars} allowHalf disabled style={{ fontSize: 14 }} />
      </div>
      <div className="rate__detail-review">
        <h4 className="review-title">Nhật xét</h4>
        <p className="review-description">{data?.content}</p>
      </div>
    </Modal>
  );
};

export default DetailRateModal;
