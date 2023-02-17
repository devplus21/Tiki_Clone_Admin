import { Pagination, Radio } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ORDER_API from '../../api/order';
import { STATUS_FAIL } from '../../constants/api';
import { CANCELED, CONFIRMED, DONE, PENDING } from '../../constants/bill';
import { useAppSelector } from '../../hooks/store';
import BillItem from './BillItem';
import './style.scss';

const orderStatusList = [
  {
    _id: '1',
    label: 'Tất cả',
    value: 'null',
  },
  {
    _id: '2',
    label: 'Đã giao',
    value: DONE,
  },
  {
    _id: '3',
    label: 'Đang giao',
    value: CONFIRMED,
  },
  {
    _id: '4',
    label: 'Đang chờ',
    value: PENDING,
  },
  {
    _id: '5',
    label: 'Đã hủy',
    value: CANCELED,
  },
];

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const Bill = () => {
  const history = useHistory();
  const query = useQuery();
  const search = window.location.search;
  const defaultPage = query.get('page');
  const defaultOrderStatus = query.get('order_status');

  const [orderStatus, setOrderStatus] = useState(defaultOrderStatus || 'null');
  const [page, setPage] = useState(defaultPage);
  const [pagination, setPagination] = useState({});

  const [bills, setBills] = useState([]);
  const { notifWs } = useAppSelector((state) => state.common);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const updateQuery = () => {
    let url = '/bills?';
    if (page) url += `page=${page}&`;
    if (orderStatus && orderStatus !== 'null')
      url += `order_status=${orderStatus}&`;

    history.replace(url);
  };

  const handleUpdateBillStatus = (newData) => {
    console.log(newData);
    const index = bills.findIndex((item) => item._id === newData._id);
    if (index < 0) return;

    const currentBills = [...bills];

    currentBills[index].order_status = newData.order_status;
    setBills(currentBills);

    if (!notifWs || newData.order_status !== CONFIRMED) return;
    const payloadMessage = {
      type: 'PUSH_MESSAGE',
      payload: {
        user_id: newData.user._id,
        content: `Đơn hàng ${newData._id} của bạn đã được xác nhận!`,
      },
    };

    notifWs.send(JSON.stringify(payloadMessage));
  };

  const handleStatusChange = ({ target: { value } }) => {
    const statusType = orderStatusList.find((item) => item.value === value);

    setPage(null);
    setOrderStatus(statusType.value);
  };

  useEffect(() => {
    (async function () {
      try {
        const response = await ORDER_API.queryOrdersList(search);
        if (response.status === STATUS_FAIL)
          return console.log(response.message);

        setBills(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [search]);

  useEffect(() => {
    updateQuery();
  }, [orderStatus, page]);

  return (
    <div className="bill">
      <div className="order__filter-wrapper">
        <Radio.Group
          onChange={handleStatusChange}
          defaultValue={orderStatus}
          size="middle"
          name="sort"
        >
          {orderStatusList.map((item) => (
            <Radio.Button key={item.value} value={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <div className="orders__list-wrapper">
        {bills?.length > 0 &&
          bills.map((item) => (
            <BillItem
              onOrderStatusChange={handleUpdateBillStatus}
              key={item._id}
              data={item}
            />
          ))}
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
  );
};

export default Bill;
