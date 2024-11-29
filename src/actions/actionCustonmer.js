import axios from "axios";
import { DELETE_CUSTOMER, FETCH_CUSTOMER, FETCH_LOADING } from "./actionTypes";

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

export const actFetchCustomer = () => {
  return (dispatch) => {
    return (
      dispatch(actLoadingApartment()),
      axios
        .get(`https://api.connecthome.vn/customer`)
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
