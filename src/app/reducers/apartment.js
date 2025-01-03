import compareAndAddArrays from "@/ultil/compareAndAddarrays";
import { decryptData } from "@/ultil/crypto";
import { getCookie } from "cookies-next";

const {
  FETCH_APARTMENT,
  CHANGE_STATUS_APARTMENT,
  SEARCH_APARTMENT,
  BAN_APARTMENT,
  THUE_APARTMENT,
  FETCH_LOADING,
  DELETE_APARTMENT,
  FETCH_REQUEST_APARTMENT,
  REQUEST_APARTMENT,
  APPROVE_APARTMENT,
  DELETE_REQUEST_APPROVE,
  EDIT_APARTMENT,
  CREATE_APARTMENT,
  SET_SELECTED_ROWS,
  CLEAR_SELECTED_ROWS,
} = require("@/actions/actionTypes");

var initialState = { data: [], selectedRows: [] };

const apartment = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LOADING:
      return { ...state, isLoading: true };
    case FETCH_APARTMENT:
      var role = getCookie("role");
      // var data = JSON.parse(
      //   Buffer.from(action.data, "base64").toString("utf-8")
      // );
      // var result = JSON.parse(
      //   Buffer.from(data.split(".")[1], "base64").toString()
      // );
      const decryptedData = decryptData(action.data.data);
      if (!decryptedData) {
        return {
          ...state,
          isLoading: false,
          error: "Data is not valid",
        };
      }
      state.data = decryptedData;

      // state.data = state.data.sort(function (x, y) {
      //   return x.status === y.status ? 0 : x.status ? -1 : 1;
      // });
      // if (role == "staff") {
      //   state.data = decryptedData.filter((item) => item.status == true);
      // }
      return {
        ...state,
        isLoading: false,
        total_page: action.data.total_page,
        search: false,
        page: action.data.page,
        selectedRows: state.selectedRows || [],
      };
    case CREATE_APARTMENT:
      state.data.unshift(action.data);
      return { ...state, isLoading: false };
    case EDIT_APARTMENT:
      console.log(action);
      var stateIndex = state.data.findIndex(
        (item) => item._id == action.data._id
      );
      state.data[stateIndex] = action.data;
      return { ...state, isLoading: false };
    case CHANGE_STATUS_APARTMENT:
      var stateIndex = state.data.findIndex(
        (item) => item._id == action.data._id
      );
      state.data[stateIndex].status = action.data.status;
      state.data[stateIndex].color = action.data.color;
      // state.data = state.data.sort(function (x, y) {
      //   return x.status === y.status ? 0 : x.status ? -1 : 1;
      // });
      return { ...state, isLoading: false };
    case SEARCH_APARTMENT:
      var role = getCookie("role");
      var values = action.values;
      state.data = action.data.data;
      var key = action.key;
      state.data = state.data.sort(function (x, y) {
        return x.status === y.status ? 0 : x.status ? -1 : 1;
      });

      if (role == "staff") {
        state.data = state.data.filter((item) => item.status == true);
      }
      if (key == "2") {
        console.log(state.data.filter((item) => item.sale_price > 0));
      }
      return {
        ...state,
        isLoading: false,
        total_page: action.data.total_page,
        search: true,
        values: values,
        key: key,
        page: action.data.page,
      };
    case BAN_APARTMENT:
      var role = getCookie("role");
      state.data = action.data;
      state.data = state.data.sort(function (x, y) {
        return x.status === y.status ? 0 : x.status ? -1 : 1;
      });
      if (role == "staff") {
        state.data = state.data.filter((item) => item.status == true);
      }
      return { ...state, isLoading: false };
    case THUE_APARTMENT:
      var role = getCookie("role");
      state.data = action.data;
      state.data = state.data.sort(function (x, y) {
        return x.status === y.status ? 0 : x.status ? -1 : 1;
      });
      if (role == "staff") {
        state.data = state.data.filter((item) => item.status == true);
      }
      return { ...state, isLoading: false };
    case DELETE_APARTMENT:
      var id = action.id;
      state.data = state.data.filter((item) => item._id !== id);
      return { ...state, isLoading: false };
    case FETCH_REQUEST_APARTMENT:
      var role = getCookie("role");
      var arr = [];
      for (let i = 0; i < action.data.length; i++) {
        const element = action.data[i].apartment;
        element.id = action.data[i]._id;
        arr.push(element);
      }
      state.data = arr;
      if (role == "staff") {
        state.data = state.data.filter((item) => item.status == true);
      }
      return { ...state, isLoading: false };
    case APPROVE_APARTMENT:
      var id = action.id;
      var role = getCookie("role");
      state.data = state.data.filter((item) => item._id !== id);
      if (role == "staff") {
        state.data = state.data.filter((item) => item.status == true);
      }
      return { ...state, isLoading: false };
    case DELETE_REQUEST_APPROVE: {
      var id = action.id;
      state.data = state.data.filter((item) => item._id !== id);
      return { ...state, isLoading: false };
    }
    case SET_SELECTED_ROWS: 
   localStorage.setItem('selectedRowsApartment', JSON.stringify(action.selectedRowKeys));
      state.selectedRows = action.selectedRowKeys;
      return { ...state, isLoading: false };
    case CLEAR_SELECTED_ROWS:
      localStorage.removeItem('selectedRowsApartment');
      state.selectedRows = [];
      return { ...state, isLoading: false };
    default:
      return { ...state, isLoading: false };
  }
};

export default apartment;
