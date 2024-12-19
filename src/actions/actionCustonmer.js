import axios from "axios";
import { ADD_CUSTOMER, DELETE_CUSTOMER, EDIT_CUSTOMER, FETCH_CUSTOMER, FETCH_LOADING, SEARCH_CUSTOMER } from "./actionTypes";

export const actLoadingApartment = () => {
  return {
    type: FETCH_LOADING,
  };
};

export const fetchCustomer = (data) => {
  return {
    type: FETCH_CUSTOMER,
    data,
  };
};

export const deleteCustomer = (id) => {
  return {
    type: DELETE_CUSTOMER,
    id,
  };
};

export const addCustomer = (data) => {
  return {
    type: ADD_CUSTOMER,
    data
  }
}

export const editCustomer = (data) => {
  return {
    type: EDIT_CUSTOMER,
    data
  }
}

export const searchCustomer = (data) => {
  return {
    type: SEARCH_CUSTOMER,
    data
  }
}

export const actFetchCustomer = (page) => {
  return (dispatch) => {
    return (
      dispatch(actLoadingApartment()),
      axios
        .get(`https://api.connecthome.vn/customer?page=${page}`)
        .then((res) => dispatch(fetchCustomer(res.data)))
        .catch((e) => console.log(e))
    );
  };
};

export const actDeleteCustomer = (id) => {
  return (dispatch) => {
    dispatch(actLoadingApartment),
      axios
        .post("https://api.connecthome.vn/customer/delete", { id: id })
        .then((res) => dispatch(deleteCustomer(id)))
        .catch((e) => console.log(e));
  };
};

export const actAddApartment = (data) => {
  return dispatch => {
    return dispatch(actLoadingApartment), dispatch(addCustomer(data))
  }
}