import axios from "axios";
import {
  BAN_APARTMENT,
  CHANGE_STATUS_APARTMENT,
  DELETE_APARTMENT,
  EDIT_APARTMENT,
  FETCH_APARTMENT,
  FETCH_LOADING,
  SEARCH_APARTMENT,
  THUE_APARTMENT,
} from "./actionTypes";

export const fetchApartment = (data) => {
  return {
    type: FETCH_APARTMENT,
    data,
  };
};

export const changeStatusApartment = (data) => {
  return {
    type: CHANGE_STATUS_APARTMENT,
    data,
  };
};

export const editApartment = (values) => {
  return {
    type: EDIT_APARTMENT,
    values,
  };
};

export const searchApartment = (data, key) => {
  return {
    type: SEARCH_APARTMENT,
    data,
    key,
  };
};

export const banApartment = (data) => {
  return {
    type: BAN_APARTMENT,
    data,
  };
};

export const thueApartment = (data) => {
  return {
    type: THUE_APARTMENT,
    data,
  };
};

export const actLoadingApartment = () => {
  return {
    type: FETCH_LOADING,
  };
};

export const deleteApartment = (id) => {
  return {
    type: DELETE_APARTMENT,
    id,
  };
};

export const actFetchApartment = () => {
  return (dispatch) => {
    return (
      dispatch(actLoadingApartment()),
      axios.get("https://api.connecthome.vn/apartment").then((res) => {
        dispatch(fetchApartment(res.data.data));
      })
    );
  };
};

export const actChangeStatusApartment = (values) => {
  return (dispatch) => {
    return (
      dispatch(actLoadingApartment()),
      axios
        .post("https://api.connecthome.vn/apartment/change-status", {
          id: values._id,
          status: !values.status,
        })
        .then((res) => dispatch(changeStatusApartment(res.data.data)))
        .catch((e) => console.log(e))
    );
  };
};

export const actEditApartment = (values) => {
  return (dispatch) => {
    return axios
      .post("https://api.connecthome.vn/apartment/edit", values)
      .then((res) => dispatch(editApartment(res.data.data)))
      .catch((e) => console.log(e));
  };
};

export const actSearchApartment = (values, key) => {
  return (dispatch) => {
    return (
      dispatch(actLoadingApartment()),
      axios
        .post("https://api.connecthome.vn/apartment/search", values)
        .then((res) => {
          dispatch(searchApartment(res.data.data, key));
        })
        .catch((e) => console.log(e))
    );
  };
};

export const actBanApartment = () => {
  return (dispatch) => {
    return (
      dispatch(actLoadingApartment()),
      axios
        .get("https://api.connecthome.vn/apartment/khosale")
        .then((res) => {
          dispatch(banApartment(res.data.data));
        })
        .catch((e) => console.log(e))
    );
  };
};

export const actThueApartment = () => {
  return (dispatch) => {
    return (
      dispatch(actLoadingApartment()),
      axios
        .get("https://api.connecthome.vn/apartment/khomua")
        .then((res) => {
          dispatch(thueApartment(res.data.data));
        })
        .catch((e) => console.log(e))
    );
  };
};

export const actDeleteApartment = (id) => {
  return (dispatch) => {
    dispatch(actLoadingApartment()),
      axios
        .post("https://api.connecthome.vn/apartment/delete", { id: id })
        .then((res) => {
          dispatch(deleteApartment(id));
        });
  };
};
