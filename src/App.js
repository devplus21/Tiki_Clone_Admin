import 'antd/dist/antd.min.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';
import AUTH_API from './api/auth';
import CONFIGS_API from './api/config';
import { STATUS_FAIL, STATUS_OK } from './constants/api';
import useRedirect from './hooks/redirect';
import { useAppDispatch } from './hooks/store';
import './index.css';
import MainLayout from './layouts/MainLayout';
import SignLayout from './layouts/SignLayout';
import { commonActions } from './store/common';
import createSocketClient from './utils/ws';

function App() {
  const dispatch = useAppDispatch();
  const { redirect } = useRedirect();
  const { pathname } = useLocation();
  const { userInfo } = useSelector((state) => state.common);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    AUTH_API.verify(token)
      .then((response) => {
        if (response.status === STATUS_FAIL || response.data.role > 1)
          return redirect('/auth/login');

        dispatch(commonActions.setUserInfo(response.data));
        dispatch(commonActions.toggleLogged(true));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [pathname]);

  useEffect(() => {
    CONFIGS_API.getConfigs()
      .then((response) => {
        if (response.status === STATUS_OK)
          dispatch(commonActions.setConfigs(response.data));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    (async function () {
      if (!userInfo._id || userInfo._id === '') return;

      const notificationSocket = await createSocketClient(
        `/notification/${userInfo._id}`
      );

      dispatch(commonActions.setNotifWs(notificationSocket));

      return () => {
        notificationSocket.close();
      };
    })();
  }, [userInfo]);

  return (
    <div className="App">
      <Switch>
        <Route path="/auth">
          <SignLayout />
        </Route>
        <Route path="/">
          <MainLayout />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
