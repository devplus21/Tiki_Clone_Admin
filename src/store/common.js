import { createSlice } from '@reduxjs/toolkit';

export const initState = {
  configs: {},
  isLogged: false,
  title: 'Tổng quan',
  notifWs: null,
  userInfo: {
    _id: '',
    address: '',
    first_name: '',
    last_name: '',
    avt: '',
    email: '',
    phone: '',
    sex: '',
    role: '',
  },
};

const commonSlice = createSlice({
  name: 'common',
  initialState: initState,
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    toggleLogged(state, action) {
      state.isLogged = action.payload;
    },
    setTitle(state, action) {
      state.title = action.payload;
    },
    setConfigs(state, action) {
      state.configs = action.payload;
    },
    setNotifWs(state, action) {
      state.notifWs = action.payload;
    },
  },
});

const { actions, reducer } = commonSlice;

export const commonActions = actions;
export default reducer;
