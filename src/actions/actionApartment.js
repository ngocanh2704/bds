import axios from "axios";
import {
  APPROVE_APARTMENT,
  BAN_APARTMENT,
  CHANGE_STATUS_APARTMENT,
  DELETE_APARTMENT,
  DELETE_REQUEST_APPROVE,
  EDIT_APARTMENT,
  FETCH_APARTMENT,
  FETCH_LOADING,
  FETCH_REQUEST_APARTMENT,
  REQUEST_APARTMENT,
  SEARCH_APARTMENT,
  THUE_APARTMENT,
} from "./actionTypes";
import { getCookie } from "cookies-next";

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

export const searchApartment = (data, key, values) => {
  return {
    type: SEARCH_APARTMENT,
    data,
    key,
    values,
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

export const deleteRequestApproveApartment = (id) => {
  return {
    type: DELETE_REQUEST_APPROVE,
    id,
  };
};

export const fetchRequestApartment = (data) => {
  return {
    type: FETCH_REQUEST_APARTMENT,
    data,
  };
};

export const requestApartment = (data) => {
  return {
    type: REQUEST_APARTMENT,
    data,
  };
};

export const approveApartment = (id) => {
  return {
    type: APPROVE_APARTMENT,
    id,
  };
};

//action
export const actFetchApartment = (page) => {
  return (dispatch) => {
    return (
      dispatch(actLoadingApartment()),
      axios.get(`https://api.connecthome.vn/apartment?page=${page}`).then((res) => {
        dispatch(fetchApartment(res.data));
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

export const actSearchApartment = (values, key, page) => {
  values.page = page;
  return (dispatch) => {
    return (
      dispatch(actLoadingApartment()),
      axios
        .post("https://api.connecthome.vn/apartment/search", values)
        .then((res) => {
          dispatch(searchApartment(res.data, key, values));
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

export const actDeleteRequestApproveApartment = (id) => {
  return (dispatch) => {
    dispatch(actLoadingApartment()),
      axios
        .post("https://api.connecthome.vn/apartment/remove-request-approve", {
          id: id,
        })
        .then((res) => {
          dispatch(deleteRequestApproveApartment(id));
        });
  };
};

export const actFecthRequestApartment = () => {
  return (dispatch) => {
    return (
      dispatch(actLoadingApartment()),
      axios
        .get("https://api.connecthome.vn/apartment/request")
        .then((res) => {
          console.log(res);
          dispatch(fetchRequestApartment(res.data.data));
        })
        .catch((e) => console.log(e))
    );
  };
};

export const actRequestApartment = (id) => {
  const user = getCookie("user");
  return (dispatch) => {
    return axios.post("https://api.connecthome.vn/apartment/request-data", {
      id: id,
      user: user,
    });
  };
};

export const actApproveApartment = (id) => {
  const user = getCookie("user");
  return (dispatch) => {
    return axios
      .post("https://api.connecthome.vn/apartment/approve-data", {
        id: id,
        user: user,
      })
      .then((res) => {
        dispatch(approveApartment(res.data.data.apartment));
      });
  };
};
