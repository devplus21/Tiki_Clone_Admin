import { EditFilled } from '@ant-design/icons';
import { Button, notification } from 'antd';
import moment from 'moment';
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import ORDER_API from '../../../api/order';
import { STATUS_FAIL } from '../../../constants/api';
import { CANCELED, CONFIRMED, DONE, PENDING } from '../../../constants/bill';
import { formatNumber } from '../../../utils';
import OrderItem from '../OrderItem';
import './style.scss';

const BillItem = ({ data, onOrderStatusChange }) => {
  const history = useHistory();
  const totalAmount = useMemo(() => {
    const { order_items, score, sale } = data;

    let total = order_items?.reduce((prev, cur) => {
      return prev + cur.quantity * cur.item_price;
    }, 0);

    if (score) total -= score;
    if (sale) total -= sale;
    return total;
  }, [data]);

  const updateOrderStatus = async (type) => {
    const response = await ORDER_API.updateOrder(data._id, {
      order_status: type,
    });

    if (response.status === STATUS_FAIL)
      return notification.error({
        placement: 'topRight',
        message: 'Lỗi!',
        description: response.message,
        duration: 3,
      });

    data.order_status = type;
    onOrderStatusChange && onOrderStatusChange(data);
    return notification.success({
      placement: 'topRight',
      message: 'Cập nhật thành công',
      duration: 3,
    });
  };

  const handleClickDelivery = () => {
    history.push(`/delivery/create-order/${data._id}`);
  }

  return (
    <div className="bill-item">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className={'bill-item__status ' + data.order_status}>
          {data.order_status === DONE
            ? 'Đã giao thành công'
            : data.order_status === PENDING
              ? 'Đang chờ xử lý'
              : data.order_status === CANCELED
                ? 'Khách đã hủy'
                : 'Đang giao hàng'}
        </div>
        <div className='btn-order-delivery'>
          {data.order_status === PENDING && (
            <>
              <Button
                onClick={handleClickDelivery}
                htmlType="button"
                style={{
                  borderRadius: "24px",
                  backgroundColor: "#f26522",
                  height: "46px",
                  color: "white",
                }}
              >
                <EditFilled style={{ fontSize: "16px" }} /> Tạo đơn hàng vận chuyển
                mới
              </Button>
            </>
          )}
        </div>

      </div>
      <div className="bill-item__order-list">
        {data.order_items?.map((item) => (
          <OrderItem key={item._id} data={item} />
        ))}
      </div>
      <div className="bill-item__footer">
        <div className="user__info">
          <span className="timestamp">
            {moment(data.createdAt).format('MM-DD-YYYY - HH:mm')}
          </span>
          <span className="user-fullname">
            <strong>
              {data.user?.last_name + ' ' + data.user?.first_name}
            </strong>
          </span>
          <p className="user-address">
            <strong>Địa chỉ: </strong>
            {`${data.address?.street}, P.${data.address?.ward.name}, Q.${data.address?.district.name}, ${data.address?.province.name}`}
          </p>
        </div>
        <div style={{ textAlign: 'right' }} className="footer__total-price">
          <span
            style={{
              fontSize: 14,
              color: 'black',
              fontWeight: 'normal',
              display: 'block',
              opacity: 0.8,
            }}
          >
            Phương thức thanh toán:{' '}
            {`${data.payment_type === 'PAYPAL'
              ? 'PayPal'
              : 'Thanh toán khi nhận hàng'
              }`}
          </span>
          Tổng tiền:{' '}
          <span className="total-price">{formatNumber(totalAmount)}đ</span>
        </div>
      </div>
      {
        data.order_status === PENDING && (
          <div className="actions">
            <Button onClick={() => updateOrderStatus(CONFIRMED)} type="primary">
              Xác nhận
            </Button>
          </div>
        )
      }
      {
        data.order_status === CONFIRMED && (
          <div className="actions">
            <Button onClick={() => updateOrderStatus(DONE)} type="primary">
              Đánh dấu giao thành công
            </Button>
          </div>
        )
      }
    </div >
  );
};

export default BillItem;
