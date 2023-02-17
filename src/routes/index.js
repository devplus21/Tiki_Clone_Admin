import Bill from "../pages/Bill";
import BrandPage from "../pages/Brand";
import CategoryPage from "../pages/Category";
import ChatMessenger from "../pages/Chat";
import ConfigsPage from "../pages/Configs";
import CreateProductPage from "../pages/CreateProduct";
import Delivery from "../pages/Delivery";
import CreateOrderDelivery from "../pages/Delivery/components/CreateOrder";
import EditOrder from "../pages/Delivery/components/EditOrder";
import TrackingOrder from "../pages/Delivery/components/TrackingOrder";
import OverallPage from "../pages/Overall";
import ProductPage from "../pages/Product";
import ProductDetail from "../pages/ProductDetail";
import RatePage from "../pages/Rate";
import SalePage from "../pages/Sale";
import StaffPage from "../pages/Staff";
import UserPage from "../pages/User";

const mainLayoutRoutes = [
  {
    name: 'Tổng quan',
    path: '/',
    component: OverallPage,
    exact: true,
    private: true,
  },
  // {
  //   name: 'Hỗ trợ khách hàng',
  //   path: '/chat',
  //   component: ChatMessenger,
  //   exact: true,
  // },
  {
    name: 'Sản phẩm',
    path: '/products/create',
    exact: true,
    component: CreateProductPage,
  },
  {
    name: 'Sản phẩm',
    path: '/products',
    component: ProductPage,
    exact: true,
    private: true,
  },
  {
    name: 'Thể loại',
    path: '/categories',
    component: CategoryPage,
    exact: true,
  },
  {
    name: 'Khuyến mãi',
    path: '/sales',
    component: SalePage,
    exact: true,
  },
  {
    name: 'Thương hiệu',
    path: '/brands',
    component: BrandPage,
    exact: true,
  },
  {
    name: 'Nhân viên',
    path: '/staffs',
    component: StaffPage,
    exact: true,
  },
  {
    name: 'Người dùng',
    path: '/users',
    component: UserPage,
    exact: true,
  },
  {
    name: 'Đánh giá',
    path: '/rates',
    component: RatePage,
    exact: true,
  },
  {
    name: 'ProductDetail',
    path: '/products/:slug',
    component: ProductDetail,
    exact: true,
  },
  {
    name: 'Đơn hàng',
    path: '/bills',
    component: Bill,
    exact: true,
  },
  {
    name: "GIAO HÀNG",
    path: "/delivery",
    component: Delivery,
    exact: true,
  },
  {
    name: "Tạo đơn giao hàng",
    path: "/delivery/create-order/:id",
    component: CreateOrderDelivery,
    // exact: true,
  },
  {
    name: "Chỉnh sửa đơn giao hàng",
    path: "/delivery/edit-order/:shopid",
    component: EditOrder,
    exact: true,
  },
  {
    name: "Tra cứu vận chuyển",
    path: "/tracking-order/:order_code",
    component: TrackingOrder,
    exact: true,
  },
  {
    name: "Thông tin",
    path: "/configs",
    component: ConfigsPage,
    exact: true,
  },
];

const routeSystem = {
  mainLayoutRoutes,
};

export default routeSystem;
