import axios from "axios";
import { FETCH_CUSTOMER, FETCH_LOADING } from "./actionTypes";

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
