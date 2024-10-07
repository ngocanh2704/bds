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
} = require("@/actions/actionTypes");

var initialState = { data: [] };

const apartment = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LOADING:
      return { ...state, isLoading: true };
    case FETCH_APARTMENT:
      var role = getCookie("role");
      state.data = action.data;
      state.data = state.data.sort(function (x, y) {
        return x.status === y.status ? 0 : x.status ? -1 : 1;
      });
      if (role == "staff") {
        state.data = state.data.filter((item) => item.status == true);
      }
      return { ...state, isLoading: false };
    case CHANGE_STATUS_APARTMENT:
      var stateIndex = state.data.findIndex(
        (item) => item._id == action.data._id
      );
      state.data[stateIndex].status = action.data.status;
      state.data[stateIndex].color = action.data.color;
      state.data = state.data.sort(function (x, y) {
        return x.status === y.status ? 0 : x.status ? -1 : 1;
      });
      return { ...state, isLoading: false };
    case SEARCH_APARTMENT:
      var role = getCookie("role");
      state.data = action.data;
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
      return { ...state, isLoading: false };
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
    case FETCH_REQUEST_APARTMENT:
      var arr = [];
      for (let i = 0; i < action.data.length; i++) {
        const element = action.data[i].apartment;
        element.id = action.data[i]._id;
        arr.push(element);
      }
      state.data = arr;
    case APPROVE_APARTMENT:
      var id = action.id;
      state.data = state.data.filter((item) => item._id !== id);
      if (role == "staff") {
        state.data = state.data.filter((item) => item.status == true);
      }
      return { ...state, isLoading: false };
    default:
      return { ...state, isLoading: false };
  }
};

export default apartment;
