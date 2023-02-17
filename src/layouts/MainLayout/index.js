import {
  AndroidFilled,
  AppstoreFilled,
  CarFilled,
  PercentageOutlined,
  PieChartFilled,
  ScheduleFilled,
  SettingFilled,
  SmileFilled,
  StarFilled,
  TagFilled,
  TrademarkCircleFilled,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, Popover } from "antd";
import { useEffect, useState } from "react";
import { Link, Switch, useLocation } from "react-router-dom";
import ORDER_API from "../../api/order";
import PrivatePage from "../../HOC/PrivatePage";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import routeSystem from "../../routes";
import { commonActions } from "../../store/common";
import "./style.scss";

const { Sider } = Layout;

const MainLayout = () => {
  const { title, userInfo, notifWs } = useAppSelector((state) => state.common);
  const pathname = useLocation().pathname;
  const currentEndpoint = pathname.split("/")[1] || null;
  const [orderCount, setOrderCount] = useState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentRouter = routeSystem.mainLayoutRoutes.find((item) => {
      const endpoint = item.path.split("/")[1] || null;
      return endpoint === currentEndpoint;
    });

    if (currentRouter?.name)
      dispatch(commonActions.setTitle(currentRouter.name));
  }, [pathname]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      const response = await ORDER_API.queryOrdersList("?order_status=PENDING");

      if (response.data?.length) setOrderCount(response.data.length);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!notifWs) return;

    notifWs.addEventListener("message", (message) => {
      console.log(message);
    });
  }, [notifWs]);

  const siderMenuList = [
    {
      _id: "overral",
      title: "Tổng quan",
      path: "/",
      icon: <PieChartFilled />,
    },
    // {
    //   _id: 'chat',
    //   title: 'Hỗ trợ khách háng',
    //   path: '/chat',
    //   icon: <AppstoreFilled />,
    // },
    {
      _id: "products",
      title: "Quản lý sản phẩm",
      path: "/products",
      icon: <AppstoreFilled />,
    },
    {
      _id: "brands",
      title: "Quản lý thương hiệu",
      path: "/brands",
      icon: <TrademarkCircleFilled />,
    },
    {
      _id: "categories",
      title: "Quản lý thể loại",
      path: "/categories",
      icon: <TagFilled />,
    },
    {
      _id: "sale",
      title: "Quản lý khuyến mãi",
      path: "/sales",
      icon: <PercentageOutlined />,
    },
    {
      _id: "staffs",
      title: "Quản lý nhân viên",
      path: "/staffs",
      icon: <AndroidFilled />,
    },
    {
      _id: "users",
      title: "Quản lý người dùng",
      path: "/users",
      icon: <SmileFilled />,
    },
    {
      _id: "rates",
      title: "Quản lý đánh giá",
      path: "/rates",
      icon: <StarFilled />,
    },
    {
      _id: "bills",
      title: "Quản lý đơn hàng",
      path: "/bills",
      badge: orderCount,
      icon: <ScheduleFilled />,
    },
    {
      _id: "delivery",
      title: "Quản lý giao hàng",
      path: "/delivery",
      icon: <CarFilled />,
    },
    {
      _id: "info",
      title: "Quản lý thông tin",
      path: "/configs",
      icon: <SettingFilled />,
    },
  ];

  const siderMenuListStaff = [
    // {
    //   _id: 'overral',
    //   title: 'Tổng quan',
    //   path: '/',
    //   icon: <PieChartFilled />,
    // },
    // {
    //   _id: 'chat',
    //   title: 'Hỗ trợ khách háng',
    //   path: '/chat',
    //   icon: <AppstoreFilled />,
    // },
    // {
    //   _id: 'products',
    //   title: 'Quản lý sản phẩm',
    //   path: '/products',
    //   icon: <AppstoreFilled />,
    // },
    // {
    //   _id: 'brands',
    //   title: 'Quản lý thương hiệu',
    //   path: '/brands',
    //   icon: <TrademarkCircleFilled />,
    // },
    // {
    //   _id: 'categories',
    //   title: 'Quản lý thể loại',
    //   path: '/categories',
    //   icon: <TagFilled />,
    // },
    // {
    //   _id: 'sale',
    //   title: 'Quản lý khuyến mãi',
    //   path: '/sales',
    //   icon: <PercentageOutlined />,
    // },
    // {
    //   _id: 'staffs',
    //   title: 'Quản lý nhân viên',
    //   path: '/staffs',
    //   icon: <AndroidFilled />,
    // },
    {
      _id: "users",
      title: "Quản lý người dùng",
      path: "/users",
      icon: <SmileFilled />,
    },
    {
      _id: "rates",
      title: "Quản lý đánh giá",
      path: "/rates",
      icon: <StarFilled />,
    },
    {
      _id: "bills",
      title: "Quản lý đơn hàng",
      path: "/bills",
      badge: orderCount,
      icon: <ScheduleFilled />,
    },
    {
      _id: "delivery",
      title: "Quản lý giao hàng",
      path: "/delivery",
      icon: <CarFilled />,
    },
    // {
    //   _id: 'info',
    //   title: 'Quản lý thông tin',
    //   path: '/configs',
    //   icon: <SettingFilled />,
    // },
  ];


  return (
    <div id="main__layout">
      <Layout
        style={{ minHeight: "100vh", maxHeight: "100vh", height: "100vh" }}
        hasSider
        className="main__layout"
      >
        <Sider collapsible width={320} className="main__layout-sider">
          <Link to="/" className="main__layout-logo">
            <img src="/logo.png" alt="logo" />
          </Link>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[`/${currentEndpoint}`]}
          >
            {userInfo?.role === 0 &&
              siderMenuList.map((item) => (
                <Menu.Item key={item.path} icon={item.icon}>
                  <Link
                    style={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    to={`${item.path}`}
                  >
                    {item.title}
                    {item.badge && (
                      <span className="menu-badge">{item.badge}</span>
                    )}
                  </Link>
                </Menu.Item>
              ))}

            {userInfo?.role === 1 &&
              siderMenuListStaff.map((item) => (
                <Menu.Item key={item.path} icon={item.icon}>
                  <Link
                    style={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    to={`${item.path}`}
                  >
                    {item.title}
                    {item.badge && (
                      <span className="menu-badge">{item.badge}</span>
                    )}
                  </Link>
                </Menu.Item>
              ))}
          </Menu>
        </Sider>
        <div className="main__layout-main__content">
          <div className="main__content-header">
            <h2 className="header-title">{title}</h2>
            <Link to="#" className="header-user">
              <Popover
                trigger="hover"
                content={
                  <Link style={{ color: "red" }} to="/auth/login">
                    Đăng xuất
                  </Link>
                }
              >
                <div className="user-avt">
                  <Avatar style={{ display: "flex", alignItems: "center" }}>
                    {userInfo?.first_name[0]}
                  </Avatar>
                </div>
              </Popover>
              <div className="user-username">{userInfo?.first_name}</div>
            </Link>
          </div>
          <div className="main__content-body">
            <Switch>
              {routeSystem.mainLayoutRoutes.map((item) => (
                <PrivatePage {...item} key={item.name} />
              ))}
            </Switch>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default MainLayout;
